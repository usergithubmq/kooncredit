<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * ACTUALIZAR IDENTIDAD Y BRANDING
     * Aquí corregimos el error del logo y los nuevos campos.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        // Cargamos al cliente explícitamente para evitar errores de objeto nulo
        $cliente = $user->cliente;

        $request->validate([
            'nombre_comercial' => 'required|string|max:255',
            'nombre_legal'     => 'required|string|max:255',
            'slug'             => 'required|string|max:100|unique:clientes,slug,' . $cliente->id,
            'primary_color'    => 'nullable|string|max:7',
            'login_slogan'     => 'nullable|string|max:255',
            'logo'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // 1. Actualización de campos de texto y branding
        $cliente->update([
            'nombre_comercial' => $request->nombre_comercial,
            'nombre_legal'     => $request->nombre_legal,
            'slug'             => $request->slug,
            'primary_color'    => $request->primary_color,
            'login_slogan'     => $request->login_slogan,
        ]);

        // 2. Lógica del Logo (Corrigiendo el error de persistencia)
        if ($request->hasFile('logo')) {
            // Eliminamos el archivo físico anterior para no llenar el disco de basura
            if ($cliente->logo_url && Storage::disk('public')->exists($cliente->logo_url)) {
                Storage::disk('public')->delete($cliente->logo_url);
            }

            // Guardamos el nuevo archivo en la carpeta 'logos' dentro de 'public'
            $path = $request->file('logo')->store('logos', 'public');

            // Actualizamos la base de datos con la ruta relativa
            $cliente->logo_url = $path;
            $cliente->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Identidad corporativa actualizada',
            // Devolvemos el usuario con el cliente actualizado para que React refresque el estado
            'user' => $user->load('cliente')
        ]);
    }

    /**
     * ACTUALIZAR CONTRASEÑA (Lógica Independiente)
     */
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

        // Actualizamos solo el password en la tabla users
        $request->user()->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Las credenciales de acceso han sido actualizadas.'
        ]);
    }
}
