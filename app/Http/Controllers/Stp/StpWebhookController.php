<?php

namespace App\Http\Controllers\Stp;

use App\Http\Controllers\Controller;
use App\Models\StpAbono;
use App\Models\PaymentPlan;
use App\Models\Pago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StpWebhookController extends Controller
{
    public function recibirAbono(Request $request)
    {
        // SEGURIDAD: Solo permitimos peticiones de nuestro propio servidor (Dispatcher)
        $allowedIps = ['168.231.75.146', '127.0.0.1'];

        if (!in_array($request->ip(), $allowedIps) && config('app.env') === 'production') {
            Log::warning("ACCESO NO AUTORIZADO: Intento desde " . $request->ip());
            return response()->json(['confirmacion' => 'error', 'causa' => 'Unauthorized'], 401);
        }

        // 1. Extracción de datos
        $data = $request->json()->all() ?: $request->all();

        try {
            // 2. Validación de CODI (Cuenta operativa)
            if (($data['institucionOrdenante'] ?? '') == '90903' && ($data['nombreOrdenante'] ?? '') == 'CODI VALIDA') {
                Log::info('STP_CODI_VALIDATION_SUCCESS');
                return response()->json(['confirmacion' => 'success'], 200);
            }

            // 3. Verificación de duplicados para evitar doble cobro
            $existe = StpAbono::where('clave_rastreo', $data['claveRastreo'] ?? '')
                ->where('fecha_operacion', $data['fechaOperacion'] ?? '')
                ->exists();

            if ($existe) {
                Log::warning("STP_DUPLICADO_IGNORADO: " . ($data['claveRastreo'] ?? 'SIN_CLAVE'));
                return response()->json(['confirmacion' => 'success'], 200);
            }

            // 4. Guardado con Transacción Atómica
            DB::transaction(function () use ($data) {
                // Creamos la evidencia del abono crudo
                $abono = StpAbono::create([
                    'stp_id'                    => $data['id'] ?? null,
                    'fecha_operacion'           => $data['fechaOperacion'] ?? null,
                    'institucion_ordenante'     => $data['institucionOrdenante'] ?? null,
                    'institucion_beneficiaria'  => $data['institucionBeneficiaria'] ?? null,
                    'clave_rastreo'             => $data['claveRastreo'] ?? null,
                    'monto'                     => $data['monto'] ?? 0,
                    'nombre_ordenante'          => $data['nombreOrdenante'] ?? 'ND',
                    'tipo_cuenta_ordenante'     => $data['tipoCuentaOrdenante'] ?? null,
                    'cuenta_ordenante'          => $data['cuentaOrdenante'] ?? null,
                    'rfc_curp_ordenante'        => $data['rfcCurpOrdenante'] ?? 'ND',
                    'nombre_beneficiario'       => $data['nombreBeneficiario'] ?? 'ND',
                    'tipo_cuenta_beneficiario'  => $data['tipoCuentaBeneficiario'] ?? null,
                    'cuenta_beneficiario'       => $data['cuentaBeneficiario'] ?? null,
                    'rfc_curp_beneficiario'     => $data['rfcCurpBeneficiario'] ?? 'ND',
                    'nombre_beneficiario2'      => $data['nombreBeneficiario2'] ?? 'ND',
                    'tipo_cuenta_beneficiario2' => $data['tipoCuentaBeneficiario2'] ?? null,
                    'cuenta_beneficiario2'      => $data['cuentaBeneficiario2'] ?? null,
                    'concepto_pago'             => $data['conceptoPago'] ?? 'ND',
                    'referencia_numerica'       => $data['referenciaNumerica'] ?? 0,
                    'empresa'                   => $data['empresa'] ?? 'ND',
                    'tipo_pago'                 => $data['tipoPago'] ?? 1,
                    'ts_liquidacion'            => $data['tsLiquidacion'] ?? '0',
                    'folio_codi'                => $data['folioCodi'] ?? null,
                ]);

                // Aplicamos la lógica de negocio (Conciliación)
                $this->aplicarPagoAlPlan($abono);
            });

            return response()->json(['confirmacion' => 'success'], 200);
        } catch (\Exception $e) {
            Log::error('STP_WEBHOOK_ERROR: ' . $e->getMessage());
            return response()->json(['confirmacion' => 'error', 'causa' => $e->getMessage()], 500);
        }
    }

    private function aplicarPagoAlPlan($abono)
    {
        $clabe = $abono->cuenta_beneficiario;
        $montoRecibido = (float)$abono->monto;

        if (empty($clabe)) return;

        // Buscamos el plan activo para esta CLABE
        $plan = PaymentPlan::where('cuenta_beneficiario', $clabe)
            ->whereIn('estado', ['pendiente', 'parcial'])
            ->first();

        if ($plan) {
            $nuevoAcumulado = (float)$plan->monto_pagado_acumulado + $montoRecibido;
            $deudaTotal = (float)$plan->credito + (float)$plan->moratoria;

            // Margen de 1 centavo para considerar pagado
            $nuevoEstado = ($nuevoAcumulado >= ($deudaTotal - 0.01)) ? 'pagado' : 'parcial';

            // 1. Actualizar el Plan de Pagos
            $plan->update([
                'monto_pagado_acumulado' => $nuevoAcumulado,
                'estado'                 => $nuevoEstado,
                'fecha_pago_real'        => now(),
            ]);

            // 2. Crear el registro en la tabla 'pagos' para el historial contable
            Pago::create([
                'payment_plan_id' => $plan->id,
                'stp_abono_id'    => $abono->id,
                'credito_id'      => $plan->credito_id,
                'end_user_id'     => $plan->end_user_id,
                'cliente_id'      => $plan->cliente_id,
                'monto_pago'      => $montoRecibido,
                'fecha_pago'      => now(),
                'estatus'         => 'confirmado',
                'clave_rastreo'   => $abono->clave_rastreo,
                'metodo_pago'     => 'SPEI',
                'metadata_stp'    => [
                    'banco_ordenante' => $abono->institucion_ordenante,
                    'concepto'        => $abono->concepto_pago,
                    'referencia'      => $abono->referencia_numerica
                ]
            ]);

            Log::info("Denar - PAGO_CONCILIADO: CLABE {$clabe} sumó {$montoRecibido}. Nuevo Estado: {$nuevoEstado}");
        } else {
            Log::warning("Denar - WEBHOOK_SIN_DESTINO: Se recibió pago de {$montoRecibido} para CLABE {$clabe} pero no hay plan activo.");
        }
    }
}
