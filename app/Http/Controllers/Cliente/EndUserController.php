<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\EndUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EndUserController extends Controller
{
    public function index()
    {
        $cliente = Auth::user()->cliente;

        if (!$cliente) return response()->json(['data' => []]);

        $pagadores = $cliente->endUsers()
            ->select('id', 'name', 'email', 'clabe_stp', 'referencia_interna', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'empresa' => $cliente->nombre_comercial ?? $cliente->nombre_legal,
            'total_pagadores' => $pagadores->count(),
            'data' => $pagadores
        ]);
    }

    public function validatePagador(Request $request)
    {
        $request->validate([
            'type' => 'required|in:RFC,CURP',
            'value' => 'required|string|min:10|max:18'
        ]);

        try {
            $value = strtoupper(trim($request->value));
            $personType = ($request->type === 'RFC' && strlen($value) === 12) ? "Moral" : "Física";

            return response()->json([
                'success' => true,
                'data' => [
                    'official_name' => "NOMBRE VALIDADO DE " . $value,
                    'person_type'   => $personType,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al validar documento.'], 422);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return response()->json(['error' => 'No tienes una empresa asociada.'], 422);
        }

        // REGLA DE ORO: Necesitamos el tronco de 13 dígitos
        if (!$cliente->clabe_stp_intermedia) {
            return response()->json(['error' => 'El cliente no tiene un tronco de CLABE configurado.'], 422);
        }

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|email',
            'referencia_interna' => 'nullable|string|max:50',
        ]);

        try {
            // 1. Obtener el tronco (13 dígitos: Banco + Plaza + Prefijo + ID Cliente)
            $tronco = $cliente->clabe_stp_intermedia;

            // 2. Generar consecutivo de 4 dígitos para la cuenta del pagador
            $consecutivo = str_pad(($cliente->endUsers()->count() + 1), 4, '0', STR_PAD_LEFT);

            // 3. Crear los 17 dígitos base
            $clabe17 = $tronco . $consecutivo;

            // 4. Calcular el dígito verificador real (Dígito 18)
            $digitoVerificador = $this->calcularDigitoVerificador($clabe17);

            $clabeCompleta = $clabe17 . $digitoVerificador;

            $endUser = EndUser::create([
                'cliente_id'         => $cliente->id,
                'name'               => $request->name,
                'email'              => $request->email,
                'clabe_stp'          => $clabeCompleta,
                'referencia_interna' => $request->referencia_interna,
                'is_active'          => true,
            ]);

            return response()->json([
                'message' => 'Cuenta de cobranza generada exitosamente.',
                'pagador' => $endUser
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Algoritmo de Dígito Verificador CLABE (Módulo 10 Ponderado)
     */
    private function calcularDigitoVerificador($clabe17)
    {
        $pesos = [3, 7, 1];
        $suma = 0;
        foreach (str_split($clabe17) as $key => $digito) {
            $suma += ($digito * $pesos[$key % 3]) % 10;
        }
        return (10 - ($suma % 10)) % 10;
    }
}
