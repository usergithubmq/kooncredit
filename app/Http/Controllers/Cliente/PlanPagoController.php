<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentPlan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PlanPagoController extends Controller
{
    public function generarPlan(Request $request)
    {
        // 1. Validamos incluyendo los campos nuevos y opcionales
        $validated = $request->validate([
            'user_id'               => 'required|integer',
            'clabe'                 => 'required|string',
            'monto_total'           => 'required|numeric',
            'valor_total_vehiculo'  => 'required|numeric',
            'enganche_pagado'       => 'required|numeric',
            'meses_enganche'        => 'required|integer', // Nuevo requerido
            'comision_apertura'     => 'required|numeric',
            'plazo_meses'           => 'required|integer',
            'dia_pago'              => 'required|integer|min:1|max:28',
            'descuento_pronto_pago' => 'required|numeric',
            'cargo_gps'             => 'nullable|numeric',
            'cargo_seguro'          => 'nullable|numeric',
        ]);

        // 2. Procesar valores opcionales
        $gps    = $request->input('cargo_gps', 0);
        $seguro = $request->input('cargo_seguro', 0);

        // 3. Cálculos financieros
        $montoCapital = $request->monto_total / $request->plazo_meses;
        $totalMensual = $montoCapital + $gps + $seguro;

        $planesGenerados = [];

        for ($i = 1; $i <= $request->plazo_meses; $i++) {
            $fechaNatural = Carbon::now()->addMonths($i - 1)->setDay($request->dia_pago);

            $fechaHabil = clone $fechaNatural;
            if ($fechaHabil->isWeekend()) {
                $fechaHabil = $fechaHabil->next(Carbon::MONDAY);
            }

            $plan = PaymentPlan::create([
                'user_id'                => $request->user_id,
                'cuenta_beneficiario'    => $request->clabe,
                'numero_pago'            => $i,
                'total_pagos'            => $request->plazo_meses,
                'valor_total_vehiculo'   => $request->valor_total_vehiculo,
                'enganche_pagado'        => $request->enganche_pagado,
                'meses_enganche'         => $request->meses_enganche, // Nuevo guardado
                'comision_apertura'      => $request->comision_apertura,
                'monto_final_financiado' => $request->monto_total,
                'plazo_credito_meses'    => $request->plazo_meses,    // Nuevo guardado
                'cargo_gps'              => $gps,
                'cargo_seguro'           => $seguro,
                'monto_normal'           => $totalMensual,
                'monto_pronto_pago'      => $totalMensual - $request->descuento_pronto_pago,
                'fecha_vencimiento'      => $fechaNatural->format('Y-m-d'),
                'fecha_limite_habil'     => $fechaHabil->format('Y-m-d'),
                'estado'                 => 'pendiente',
            ]);

            $planesGenerados[] = $plan;
        }

        return response()->json([
            'status' => 'success',
            'message' => "Plan de {$request->plazo_meses} meses generado con éxito.",
            'data' => $planesGenerados
        ]);
    }

    public function obtenerResumen($clabe)
    {
        $proximo = PaymentPlan::where('cuenta_beneficiario', $clabe)
            ->where('estado', 'pendiente')
            ->orderBy('numero_pago', 'asc')
            ->first();

        $totales = PaymentPlan::where('cuenta_beneficiario', $clabe)->count();
        $pagados = PaymentPlan::where('cuenta_beneficiario', $clabe)->where('estado', 'pagado')->count();

        return response()->json([
            'proximo_pago' => $proximo,
            'stats' => [
                'total_meses' => $totales,
                'meses_pagados' => $pagados,
                'progreso_porcentaje' => $totales > 0 ? round(($pagados / $totales) * 100) : 0,
                'restante' => $totales - $pagados
            ]
        ]);
    }
}
