<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserWalletController extends Controller
{
    public function getDashboard(Request $request)
    {
        // Datos de prueba para que el iPhone no explote al entrar
        return response()->json([
            'status' => 'success',
            'data' => [
                'saldo' => 1500.00,
                'clabe' => '012345678901234567',
                'pago_pendiente' => 450.00,
            ]
        ]);
    }

    public function getPaymentHistory(Request $request)
    {
        return response()->json(['status' => 'success', 'data' => []]);
    }
}
