<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentPlan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PlanPagoController extends Controller
{
    /**
     * Genera un nuevo plan de pago para un usuario.
     */
    public function generarPlan(Request $request)
    {
        $request->validate([
            'user_id'             => 'required|exists:users,id',
            'cuenta_beneficiario' => 'required|string',
            'credito'             => 'required|numeric', // Cambiado de monto_credito a credito
            'monto_normal'        => 'required|numeric',
            'moratoria'           => 'required|numeric',
        ]);

        try {
            $plan = PaymentPlan::create([
                'user_id'             => $request->user_id,
                'cuenta_beneficiario' => $request->cuenta_beneficiario,
                'referencia_contrato' => $request->referencia_contrato,

                // Mapeo directo al campo 'credito' de tu modelo
                'credito'             => $request->credito,
                'monto_normal'        => $request->monto_normal,
                'moratoria'           => $request->moratoria,

                'fecha_vencimiento'   => now()->addDays(30)->format('Y-m-d'),
                'fecha_limite_habil'  => now()->addDays(35)->format('Y-m-d'),

                'estado'              => $request->estado ?? 'pendiente',
                'monto_pagado_acumulado' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Plan de pago generado con éxito',
                'plan'    => $plan
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error generando plan: " . $e->getMessage());
            return response()->json(['error' => 'Error en DB: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene el resumen financiero para el Dashboard.
     */
    public function obtenerResumen(Request $request)
    {
        $clabe = $request->cuenta_beneficiario;
        $plan = PaymentPlan::where('cuenta_beneficiario', $clabe)->first();

        if (!$plan) {
            return response()->json(['data' => null], 404);
        }

        $acumulado = (float)($plan->monto_pagado_acumulado ?? 0);
        $credito   = (float)($plan->credito ?? 0); // Usando el campo correcto
        $moratoria = (float)($plan->moratoria ?? 0);

        // Saldo Pendiente (Max 0 por si hay sobrepago)
        $saldoPendiente = max(0, $credito - $acumulado);
        $saldoTotal = $saldoPendiente + $moratoria;

        // Progreso con tope al 100%
        $progresoReal = ($credito > 0) ? ($acumulado / $credito) * 100 : 0;
        $progresoVisual = min(100, round($progresoReal));

        return response()->json([
            'data' => [
                'credito'         => $credito,    // Nombre de campo real
                'monto_mensual'   => (float)$plan->monto_normal,
                'monto_acumulado' => $acumulado,
                'moratoria'       => $moratoria,
                'saldo_total'     => $saldoTotal,
                'progreso'        => $progresoVisual,
                'referencia'      => $plan->referencia_contrato ?? 'S/R',
                'estado'          => $plan->estado
            ]
        ]);
    }
}
