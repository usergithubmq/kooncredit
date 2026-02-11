<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IneController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'ine_front' => 'required|image|max:5000',
            'ine_back'  => 'required|image|max:5000',
        ]);

        $user = Auth::user();

        // Guardar archivos
        $frontPath = $request->file('ine_front')->store("ine/{$user->id}", 'public');
        $backPath  = $request->file('ine_back')->store("ine/{$user->id}", 'public');

        // GUARDAR EN COLUMNAS REALES
        $user->ine_front = $frontPath;
        $user->ine_back  = $backPath;
        $user->save();

        return response()->json([
            "message" => "INE subida correctamente",
            "paths" => [
                "ine_front" => $frontPath,
                "ine_back"  => $backPath,
            ]
        ], 200);
    }


    public function process(Request $request)
    {
        $user = Auth::user();

        if (!$user->ine_front || !$user->ine_back) {
            return response()->json([
                "message" => "INE no subida",
                "status"  => "error"
            ], 422);
        }

        // OCR simulado
        $fakeOCR = [
            "name" => "MILTON QUIROZ",
            "curp" => "QUIR001122HDFMLT04",
            "clave_elector" => "QRMMLT001122H900",
            "vigencia" => "2032",
        ];

        $user->ine_verified = true;
        $user->curp = $fakeOCR["curp"];
        $user->save();

        return response()->json([
            "message" => "INE procesada exitosamente",
            "status" => "verified",
            "ocr_data" => $fakeOCR,
        ], 200);
    }

    public function status()
    {
        $user = Auth::user();

        return response()->json([
            "ine_uploaded" => (bool) ($user->ine_front && $user->ine_back),
            "ine_verified" => (bool) $user->ine_verified,
            "liveness_verified" => (bool) $user->liveness_verified,
            "complete" => ($user->ine_verified && $user->liveness_verified),
        ]);
    }
}
