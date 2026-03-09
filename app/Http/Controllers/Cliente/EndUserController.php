<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EndUser;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class EndUserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        // Verificamos que el usuario tenga un perfil de cliente asociado
        if (!$user->cliente) {
            return response()->json(['data' => [], 'message' => 'Sin empresa asociada'], 200);
        }

        try {
            $pagadores = $user->cliente->endUsers()
                ->select('id', 'name', 'email', 'clabe_stp', 'referencia_interna', 'is_active', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'empresa' => $user->cliente->nombre_comercial ?? $user->cliente->nombre_legal ?? 'Mi Empresa',
                'total_pagadores' => $pagadores->count(),
                'data' => $pagadores
            ]);
        } catch (\Exception $e) {
            // Esto registrará el error real en tu archivo storage/logs/laravel.log
            Log::error('Error cargando pagadores: ' . $e->getMessage());
            return response()->json(['error' => 'Error al cargar listado.'], 500);
        }
    }

    public function validatePagador(Request $request)
    {
        // OJO: Comentamos el validate para que no bloquee nada
        // $request->validate([...]); 

        $user = 'koonfinancen';
        $pass = 'wxg28!eqG';

        // Logueamos qué recibe el servidor
        \Log::info('Datos recibidos:', $request->all());

        try {
            $value = strtoupper(trim($request->value));

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($user . ':' . $pass),
                'Accept'        => 'application/json',
            ])->post('https://api.nubarium.com/renapo/v2/valida_curp', [
                'curp'      => $value,
                'documento' => '0'
            ]);

            return response()->json([
                'success' => $response->successful(),
                'status'  => $response->status(),
                'data'    => $response->json() // Devolvemos TODO lo que responda Nubarium
            ], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) return response()->json(['error' => 'No tienes una empresa asociada.'], 422);

        // Validación de tronco de CLABE para STP
        $tronco = $cliente->clabe_stp_intermedia;
        if (!$tronco) return response()->json(['error' => 'El cliente no tiene un tronco de CLABE configurado.'], 422);

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'referencia_interna' => 'nullable|string|max:50',
            'document_value' => 'required|string'
        ]);

        // Guardamos el resultado en una variable fuera de la transacción
        $resultado = DB::transaction(function () use ($request, $cliente, $tronco) {
            // 1. Crear el usuario de acceso a la APP
            // Se define el rol como 'pagador' según lo discutido
            $nuevoAcceso = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->document_value),
                'role'     => 'analista',
            ]);

            // 2. Generar CLABE STP (Lógica de 18 dígitos)
            $consecutivo = str_pad(($cliente->endUsers()->count() + 1), 4, '0', STR_PAD_LEFT);
            $clabe17 = $tronco . $consecutivo;
            $digitoVerificador = $this->calcularDigitoVerificador($clabe17);
            $clabeCompleta = $clabe17 . $digitoVerificador;

            // 3. Crear el registro de EndUser (Pagador) vinculado
            $endUser = EndUser::create([
                'cliente_id'         => $cliente->id,
                'user_id'            => $nuevoAcceso->id, // Vinculación realizada
                'name'               => $request->name,
                'email'              => $request->email,
                'clabe_stp'          => $clabeCompleta,
                'referencia_interna' => $request->referencia_interna,
                'is_active'          => true,
            ]);

            return [
                'endUser' => $endUser,
                'userId'  => $nuevoAcceso->id
            ];
        });

        // Retornamos la respuesta fuera del closure de la transacción
        return response()->json([
            'message' => 'Usuario y Cuenta de cobranza generados.',
            'pagador' => $resultado['endUser'],
            'user_id' => $resultado['userId']
        ], 201);
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
