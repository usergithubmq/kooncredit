<?php

namespace App\Http\Controllers\Stp;

use App\Http\Controllers\Controller;
use App\Models\StpAbono;
use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StpWebhookController extends Controller
{
    public function recibirAbono(Request $request)
    {
        // 1. Log de entrada (Vital para soporte con STP)
        Log::info('STP_WEBHOOK_RAW_DATA:', $request->all());

        try {
            // 2. Validación de CODI (Validación de cuenta operativa)
            if ($request->institucionOrdenante == '90903' && $request->nombreOrdenante == 'CODI VALIDA') {
                Log::info('STP_CODI_VALIDATION_SUCCESS');
                return response()->json(['confirmacion' => 'success'], 200);
            }

            // 3. Verificación de duplicados (No procesar dos veces la misma Clave de Rastreo)
            $existe = StpAbono::where('clave_rastreo', $request->claveRastreo)
                ->where('fecha_operacion', $request->fechaOperacion)
                ->exists();
            if ($existe) {
                Log::warning("STP_DUPLICADO_IGNORADO: {$request->claveRastreo}");
                return response()->json(['confirmacion' => 'success'], 200);
            }

            // 4. Guardado con Mapeo (CamelCase de STP -> snake_case de DB)
            DB::transaction(function () use ($request) {
                StpAbono::create([
                    'stp_id'                 => $request->id,
                    'fecha_operacion'        => $request->fechaOperacion,
                    'institucion_ordenante'  => $request->institucionOrdenante,
                    'institucion_beneficiaria' => $request->institucionBeneficiaria,
                    'clave_rastreo'          => $request->claveRastreo,
                    'monto'                  => $request->monto,
                    'nombre_ordenante'       => $request->nombreOrdenante,
                    'tipo_cuenta_ordenante'  => $request->tipoCuentaOrdenante,
                    'cuenta_ordenante'       => $request->cuentaOrdenante,
                    'rfc_curp_ordenante'     => $request->rfcCurpOrdenante,
                    'nombre_beneficiario'    => $request->nombreBeneficiario,
                    'tipo_cuenta_beneficiario' => $request->tipoCuentaBeneficiario,
                    'cuenta_beneficiario'    => $request->cuentaBeneficiario,
                    'rfc_curp_beneficiario'  => $request->rfcCurpBeneficiario,
                    'nombre_beneficiario2'   => $request->nombreBeneficiario2,
                    'tipo_cuenta_beneficiario2' => $request->tipoCuentaBeneficiario2,
                    'cuenta_beneficiario2'   => $request->cuentaBeneficiario2,
                    'concepto_pago'          => $request->conceptoPago,
                    'referencia_numerica'    => $request->referenciaNumerica,
                    'empresa'                => $request->empresa,
                    'tipo_pago'              => $request->tipoPago,
                    'ts_liquidacion'         => $request->tsLiquidacion,
                    'folio_codi'             => $request->folioCodi,
                ]);

                $this->aplicarPagoAlPlan($request->cuentaBeneficiario, $request->monto);
            });

            // 5. RESPUESTA RÁPIDA (STP solo tiene 2500ms)
            return response()->json(['confirmacion' => 'success'], 200);
        } catch (\Exception $e) {
            // ESTO NOS DIRÁ EL ERROR REAL EN LA TERMINAL
            Log::error('STP_ERROR: ' . $e->getMessage());
            return response()->json([
                'confirmacion' => 'error',
                'causa' => $e->getMessage(), // <--- Esto te dirá qué falta
                'line' => $e->getLine()
            ], 500);
        }
    }

    private function aplicarPagoAlPlan($clabe, $montoRecibido)
    {
        // 1. Buscamos la mensualidad más antigua que esté pendiente
        $plan = PaymentPlan::where('cuenta_beneficiario', $clabe)
            ->where('estado', 'pendiente')
            ->orderBy('numero_pago', 'asc')
            ->first();

        if ($plan) {
            $hoy = Carbon::now();
            $fechaLimite = Carbon::parse($plan->fecha_limite_habil);

            // 2. Determinamos monto esperado según tu regla de fecha hábil
            $esProntoPago = $hoy->lte($fechaLimite);
            $montoEsperado = $esProntoPago ? $plan->monto_pronto_pago : $plan->monto_normal;

            // 3. Si el dinero cubre la deuda, marcamos como pagado
            if ($montoRecibido >= ($montoEsperado - 1)) {
                $plan->update([
                    'estado' => 'pagado',
                    'updated_at' => $hoy
                ]);
                Log::info("PLAN_PAGO_LIQUIDADO: Pago #{$plan->numero_pago} de la CLABE {$clabe}");
            } else {
                Log::warning("PLAN_PAGO_INSUFICIENTE: Mandó {$montoRecibido} pero se esperaba {$montoEsperado}");
            }
        }
    }
}
