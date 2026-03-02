<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'email'       => 'required|string|email|unique:users',
            'phone'       => 'required|string|unique:clientes', // Validar en clientes
            'password'    => 'required|string|min:8',
            'person_type' => 'required|in:fisica,moral',
            'first_last'  => 'required_if:person_type,fisica|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // 1. Crear el Usuario (Credenciales de acceso)
                $user = User::create([
                    'name'        => $request->name,
                    'first_last'  => $request->first_last,
                    'second_last' => $request->second_last,
                    'email'       => $request->email,
                    'password'    => Hash::make($request->password),
                    'role'        => 'cliente',
                ]);

                // 2. Crear el Perfil de Cliente (Estado Onboarding)
                // Nota: Aquí NO generamos CLABE todavía, eso lo haces tú en Admin
                // o se dispara cuando termine el Onboarding.
                $user->cliente()->create([
                    'tipo_cliente' => ($request->person_type === 'moral') ? 'empresa' : 'persona',
                    'phone'        => $request->phone,
                    'estatus'      => 'incompleto', // Esperando Liveness e INE
                ]);

                // Generar Token para que pueda seguir con la Prueba de Vida
                $token = $user->createToken('onboarding_token')->plainTextToken;

                return response()->json([
                    'message' => 'Usuario registrado, procediendo a verificación',
                    'user_id' => $user->id,
                    'token'   => $token,
                    'phone'   => $request->phone
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en registro: ' . $e->getMessage()], 500);
        }
    }
}
