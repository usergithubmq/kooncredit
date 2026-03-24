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

        if (!$user->cliente) {
            return response()->json(['data' => [], 'message' => 'Sin empresa asociada'], 200);
        }

        try {
            $pagadores = $user->cliente->endUsers()
                ->with('user')
                ->select('id', 'user_id', 'cliente_id', 'clabe_stp', 'referencia_interna', 'is_active', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($endUser) {
                    return [
                        'id'                 => $endUser->id,
                        'name'               => $endUser->user->name ?? 'N/A',
                        'email'              => $endUser->user->email ?? 'N/A',
                        'clabe_stp'          => $endUser->clabe_stp,
                        'referencia_interna' => $endUser->referencia_interna,
                        'is_active'          => $endUser->is_active,
                        'created_at'         => $endUser->created_at,
                    ];
                });

            return response()->json([
                'empresa'         => $user->cliente->nombre_comercial ?? $user->cliente->nombre_legal ?? 'Mi Empresa',
                'total_pagadores' => $pagadores->count(),
                'data'            => $pagadores
            ]);
        } catch (\Exception $e) {
            Log::error('Error cargando pagadores: ' . $e->getMessage());
            return response()->json(['error' => 'Error al cargar listado: ' . $e->getMessage()], 500);
        }
    }

    public function validatePagador(Request $request)
    {
        try {
            $user = env('NUBARIUM_USER');
            $pass = env('NUBARIUM_PASS');

            if (!$request->value) {
                return response()->json(['success' => false, 'message' => 'RFC no proporcionado'], 400);
            }

            $rfc = strtoupper(trim($request->value));

            // BYPASS PARA DESARROLLO LOCAL
            if (env('APP_ENV') === 'local') {
                return response()->json([
                    'success' => true,
                    'status'  => 200,
                    'data'    => [
                        'rfc' => $rfc,
                        'datosIdentificacion' => [
                            'nombres' => 'USUARIO PRUEBA ' . rand(1, 99),
                            'apellidoPaterno' => 'KOON',
                            'apellidoMaterno' => 'SYSTEM',
                            'curp' => 'MOCK' . rand(1000, 9999) . 'HDF' . rand(10, 99)
                        ],
                        'datosUbicacion' => [
                            'cp' => '06000',
                            'entidadFederativa' => 'CIUDAD DE MÉXICO',
                            'municipioDelegacion' => 'CUAUHTÉMOC'
                        ]
                    ]
                ], 200);
            }

            // LLAMADA REAL A NUBARIUM
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode($user . ':' . $pass),
                'Accept'        => 'application/json',
            ])->post('https://api.nubarium.com/sat/v1/consultar_cif', [
                'rfc'  => $rfc,
                'tipo' => 'datos'
            ]);

            return response()->json([
                'success' => $response->successful(),
                'status'  => $response->status(),
                'data'    => $response->json()
            ], $response->status());
        } catch (\Exception $e) {
            Log::error("Error en validatePagador: " . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Error de conexión'], 500);
        }
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        try {
            return DB::transaction(function () use ($request, $cliente) {
                // A. Crear Usuario con lo que viene del Form
                $nuevoUsuario = User::create([
                    'name'       => $request->name,
                    'first_last' => $request->first_last,
                    'email'      => $request->email,
                    'password'   => Hash::make($request->document_value),
                    'role'       => 'cliente_final',
                    'rfc'        => strtoupper($request->document_value),
                ]);

                // B. Generar CLABE
                $tronco = $cliente->clabe_stp_intermedia;
                $consecutivo = str_pad(($cliente->endUsers()->count() + 1), 4, '0', STR_PAD_LEFT);
                $clabe17 = $tronco . $consecutivo;
                $clabeCompleta = $clabe17 . $this->calcularDigitoVerificador($clabe17);

                // C. Crear EndUser con TU REFERENCIA
                $contrato = EndUser::create([
                    'cliente_id'         => $cliente->id,
                    'user_id'            => $nuevoUsuario->id,
                    'clabe_stp'          => $clabeCompleta,
                    'referencia_interna' => $request->referencia_interna, // <--- AQUÍ SE GUARDA TU DATO REAL
                    'is_active'          => true,
                ]);

                // Devolvemos el objeto para que React lo reciba
                return response()->json([
                    'success' => true,
                    'data'    => $contrato
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function calcularDigitoVerificador($clabe17)
    {
        $pesos = [3, 7, 1];
        $suma = 0;
        foreach (str_split($clabe17) as $key => $digito) {
            if (!is_numeric($digito)) continue;
            $suma += ($digito * $pesos[$key % 3]) % 10;
        }
        return (10 - ($suma % 10)) % 10;
    }
}
