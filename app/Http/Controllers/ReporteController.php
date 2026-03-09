<?php

namespace App\Http\Controllers;

use App\Models\StpAbono;
use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReporteController extends Controller
{
    public function reporteConciliacion()
    {
        try {
            // 1. Estadísticas Generales (KPIs)
            $totalRecibido = StpAbono::sum('monto');
            $pagosConciliados = PaymentPlan::where('estado', 'pagado')->count();
            // Asumimos que si no hay plan, el dinero está "flotando"
            $porConciliar = StpAbono::whereNotExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('payment_plans')
                    ->whereRaw('payment_plans.cuenta_beneficiario = stp_abonos.cuenta_beneficiario');
            })->count();

            // 2. Datos para la Gráfica (Últimos 7 días)
            $chartData = StpAbono::select(
                DB::raw('DATE(created_at) as fecha'),
                DB::raw('SUM(monto) as monto')
            )
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('fecha')
                ->orderBy('fecha', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'fecha' => Carbon::parse($item->fecha)->format('d M'),
                        'monto' => (float) $item->monto
                    ];
                });

            // 3. Últimos 5 movimientos detallados
            $recentPayments = StpAbono::latest()
                ->take(5)
                ->get()
                ->map(function ($p) {
                    return [
                        'nombre_ordenante' => $p->nombre_ordenante ?: 'Desconocido',
                        'fecha' => $p->created_at->diffForHumans(),
                        'monto' => number_format($p->monto, 2),
                        'rastreo' => $p->clave_rastreo
                    ];
                });

            return response()->json([
                'stats' => [
                    'total_recibido' => (float) $totalRecibido,
                    'pagos_validados' => $pagosConciliados,
                    'por_conciliar' => $porConciliar
                ],
                'chartData' => $chartData,
                'recentPayments' => $recentPayments
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
