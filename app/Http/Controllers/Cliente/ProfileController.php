<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $cliente = $user->cliente; // Asumiendo relación User -> Cliente

        $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'nombre_legal'     => 'required|string|max:255',
            'logo'             => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'password'         => ['nullable', 'confirmed', Password::min(8)],
        ]);

        // 1. Actualizar Datos del Cliente
        $cliente->update([
            'nombre_comercial' => $request->nombre_comercial,
            'nombre_legal'     => $request->nombre_legal,
        ]);

        // 2. Manejo de Logo Premium
        if ($request->hasFile('logo')) {
            if ($cliente->logo_url) {
                Storage::disk('public')->delete($cliente->logo_url);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $cliente->update(['logo_url' => $path]);
        }

        // 3. Actualizar Password si se envió
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Terminal Sincronizada correctamente',
            'user' => $user->load('cliente')
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => [
                'required',
                'confirmed',
                Password::min(10)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        // Agregamos 'status' => 'success' para que el Front lo detecte fácil
        return response()->json([
            'status' => 'success',
            'message' => 'Credenciales actualizadas con éxito.'
        ]);
    }
}
