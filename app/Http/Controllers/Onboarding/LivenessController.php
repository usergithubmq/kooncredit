<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LivenessController extends Controller
{
    /**
     * Guardar resultado del liveness check
     */
    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|in:passed,failed',
        ]);

        $user = $request->user();

        $user->liveness_verified = ($request->status === 'passed');
        $user->save();

        return response()->json([
            'message' => 'Liveness check guardado correctamente',
            'liveness_verified' => $user->liveness_verified
        ]);
    }

    /**
     * Consultar estado del liveness para saber si pasar a la siguiente pantalla
     */
    public function status(Request $request)
    {
        return response()->json([
            'liveness_verified' => $request->user()->liveness_verified
        ]);
    }
}
