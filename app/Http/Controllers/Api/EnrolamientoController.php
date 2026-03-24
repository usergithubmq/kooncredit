<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EndUser;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EnrolamientoController extends Controller
{
    public function registrar(Request $request)
    {
        $request->validate([
            'referencia_contrato' => 'required|string',
            'rfc'                 => 'required|string',
            'monto_normal'        => 'required|numeric',
            'moratoria'           => 'required|numeric',
            'email'               => 'required|email|unique:users,email',
        ]);

        $empresa = auth()->user()->cliente;
        if (!$empresa || !$empresa->clabe_stp_intermedia) {
            return response()->json(['error' => 'Configuración de CLABE incompleta.'], 422);
        }

        try {
            return DB::transaction(function () use ($request, $empresa) {
                // 1. CONSULTA NUBARIUM SAT
                $fiscalData = $this->obtenerDatosSat($request->rfc);
                $idData = $fiscalData['datosIdentificacion'] ?? [];
                $locData = $fiscalData['datosUbicacion'] ?? [];

                // 2. CREAR USUARIO CON NUEVA ESTRUCTURA
                $passwordProvisional = strtoupper($request->rfc);
                $nuevoUsuario = User::create([
                    'name'                    => $idData['nombres'] ?? 'USUARIO',
                    'first_last'              => $idData['apellidoPaterno'] ?? 'REGISTRADO',
                    'second_last'             => $idData['apellidoMaterno'] ?? null,
                    'email'                   => strtolower($request->email),
                    'rfc'                     => strtoupper($request->rfc),
                    'curp'                    => $idData['curp'] ?? null,
                    'cif'                     => $fiscalData['cif'] ?? null,
                    'situacion_contribuyente' => $idData['situacionContribuyente'] ?? null,
                    'cp'                      => $locData['cp'] ?? null,
                    'entidad_federativa'      => $locData['entidadFederativa'] ?? null,
                    'municipio_delegacion'    => $locData['municipioDelegacion'] ?? null,
                    'colonia'                 => $locData['colonia'] ?? null,
                    'calle'                   => $locData['nombreVialidad'] ?? null,
                    'num_exterior'            => $locData['numeroExterior'] ?? null,
                    'num_interior'            => $locData['numeroInterior'] ?? null,
                    'password'                => Hash::make($passwordProvisional),
                    'role'                    => 'cliente_final',
                ]);

                // 3. GENERAR CLABE STP
                $tronco = $empresa->clabe_stp_intermedia;
                $consecutivo = str_pad(($empresa->endUsers()->count() + 1), 4, '0', STR_PAD_LEFT);
                $clabe17 = $tronco . $consecutivo;
                $clabeCompleta = $clabe17 . $this->calcularDigitoVerificador($clabe17);

                // 4. CREAR ENDUSER
                EndUser::create([
                    'cliente_id'         => $empresa->id,
                    'user_id'            => $nuevoUsuario->id,
                    'clabe_stp'          => $clabeCompleta,
                    'referencia_interna' => $request->referencia_contrato,
                    'is_active'          => true,
                ]);

                // 5. CREAR PLAN DE PAGO
                PaymentPlan::create([
                    'user_id'             => $nuevoUsuario->id,
                    'cuenta_beneficiario' => $clabeCompleta,
                    'referencia_contrato' => $request->referencia_contrato,
                    'monto_normal'        => $request->monto_normal,
                    'moratoria'           => $request->moratoria,
                    'estado'              => 'pendiente',
                    'fecha_vencimiento'   => now()->addDays(30)->format('Y-m-d'),
                ]);

                return response()->json([
                    'status' => 'success',
                    'data'   => [
                        'name' => ($idData['nombres'] ?? 'USUARIO') . ' ' . ($idData['apellidoPaterno'] ?? ''),
                        'cuenta_beneficiario' => $clabeCompleta,
                        'password' => $passwordProvisional
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Error Enrolamiento API: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    private function obtenerDatosSat($rfc)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('NUBARIUM_USER') . ':' . env('NUBARIUM_PASS')),
            ])->post('https://api.nubarium.com/sat/v1/consultar_cif', [
                'rfc'  => strtoupper(trim($rfc)),
                'tipo' => 'datos'
            ]);

            return $response->successful() ? $response->json() : [];
        } catch (\Exception $e) {
            Log::warning('Fallo Nubarium SAT: ' . $e->getMessage());
            return [];
        }
    }

    private function calcularDigitoVerificador($clabe17)
    {
        $pesos = [3, 7, 1];
        $suma = 0;
        foreach (str_split($clabe17) as $key => $digito) {
            $suma += ($digito * $pesos[$key % 3]) % 10;
        }
        return (10 - ($suma % 10)) % 10;
    }

    public function consultarSaldo(Request $request)
    {
        $request->validate([
            'cuenta_beneficiario' => 'required|string',
        ]);

        $plan = PaymentPlan::where('cuenta_beneficiario', $request->cuenta_beneficiario)
            ->where('estado', '!=', 'pagado')
            ->first();

        if (!$plan) {
            return response()->json(['status' => 'error', 'message' => 'No hay pagos pendientes.'], 404);
        }

        $montoNormal = (float) $plan->monto_normal;
        $moratoria   = (float) $plan->moratoria;
        $yaPagado    = (float) $plan->monto_pagado_acumulado;
        $totalActual = ($montoNormal + $moratoria) - $yaPagado;

        return response()->json([
            'status' => 'success',
            'data' => [
                'referencia'     => $plan->referencia_contrato,
                'monto_mensual'  => $montoNormal,
                'moratoria'      => $moratoria,
                'abonado'        => $yaPagado,
                'total_a_pagar'  => max(0, $totalActual),
                'clabe_deposito' => $plan->cuenta_beneficiario,
                'vencimiento'    => $plan->fecha_vencimiento
            ]
        ]);
    }

    public function listarPagadores(Request $request)
    {
        try {
            $user = auth()->user();
            $empresa = $user->cliente;

            if (!$empresa) {
                return response()->json(['error' => 'Usuario sin empresa vinculada'], 403);
            }

            // Usamos ordenamiento por ID para evitar el error de columna 'name' inexistente en end_users
            $pagadores = EndUser::where('cliente_id', $empresa->id)
                ->with(['user.paymentPlan'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($endUser) {
                    $u = $endUser->user;
                    $plan = $u ? $u->paymentPlan : null;

                    // Mapeo exacto para StpAccountsTable.jsx
                    return [
                        'id'                 => $endUser->id,
                        'name'               => $u->name ?? 'N/A',
                        'email'              => $u->email ?? 'N/A',
                        'clabe_stp'          => $endUser->clabe_stp,
                        'referencia_interna' => $endUser->referencia_interna,
                        'monto_total'        => $plan ? ((float)$plan->monto_normal + (float)$plan->moratoria) : 0,
                        'estatus'            => $plan->estado ?? 'Pendiente',
                    ];
                });

            return response()->json($pagadores);
        } catch (\Exception $e) {
            Log::error('Error cargando pagadores: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al listar'], 500);
        }
    }
}
