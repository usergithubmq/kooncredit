<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StpAbono;
use Illuminate\Http\Request;

class UserWalletController extends Controller
{
    public function getDashboard(Request $request)
    {
        $user = $request->user();

        // Traemos el resumen de pagos y el historial reciente en una sola carga
        $abonos = StpAbono::where('cuenta_beneficiario', $user->clabe_stp)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'user_info' => [
                    'name' => $user->name,
                    'clabe' => $user->clabe_stp,
                    'onboarding' => $user->onboarding_status,
                ],
                'balance' => [
                    'total_paid' => $abonos->sum('monto'),
                    'pending_amount' => $user->moratoria ?? 0, // Ajustar según tu lógica
                    'currency' => 'MXN'
                ],
                'recent_history' => $abonos->take(5) // Solo los últimos 5 para el dashboard
            ]
        ]);
    }

    public function getPaymentHistory(Request $request)
    {
        $history = StpAbono::where('cuenta_beneficiario', $request->user()->clabe_stp)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($history);
    }
}
