<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class PublicBrandingController extends Controller
{
    /**
     * Esta ruta es PÚBLICA. 
     * Sirve para que el React pinte el Login antes de entrar.
     */
    public function getBranding($slug)
    {
        // Buscamos al cliente por su slug (que añadimos en la migración)
        $cliente = Cliente::where('slug', $slug)
            ->select('nombre_comercial', 'logo_url', 'primary_color', 'login_slogan')
            ->first();

        if (!$cliente) {
            // Si no existe, el Front usará los colores de Denar por defecto
            return response()->json(['message' => 'Default Branding'], 404);
        }

        return response()->json([
            'name'    => $cliente->nombre_comercial,
            // Si usas Storage, asegúrate de devolver la URL completa
            'logo'    => $cliente->logo_url ? asset('storage/' . $cliente->logo_url) : null,
            'color'   => $cliente->primary_color ?? '#22d3ee',
            'slogan'  => $cliente->login_slogan,
            'network' => $slug . '.network'
        ]);
    }
}
