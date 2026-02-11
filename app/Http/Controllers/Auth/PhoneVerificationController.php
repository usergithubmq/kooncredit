<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Twilio\Rest\Client;

class PhoneVerificationController extends Controller
{
    public function sendCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string'
        ]);

        $twilio = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));

        $verification = $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SID'))
            ->verifications
            ->create($request->phone, "sms");

        return response()->json([
            'message' => 'Código enviado.',
            'status' => $verification->status
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code'  => 'required|string',
        ]);

        // Normalizar teléfono
        $phone = preg_replace('/\D+/', '', $request->phone);

        if (!str_starts_with($phone, '52')) {
            $phone = '52' . $phone;
        }
        $phone = '+' . $phone;

        $twilio = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));

        $check = $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SID'))
            ->verificationChecks
            ->create([
                'to' => $phone,
                'code' => $request->code,
            ]);

        if ($check->status !== 'approved') {
            return response()->json([
                'message' => 'Código incorrecto o expirado.',
            ], 422);
        }

        // Buscar usuario ya normalizado
        $user = User::where('phone', $phone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado para ese número.',
            ], 404);
        }

        $user->phone_verified_at = now();
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Teléfono verificado correctamente.',
            'token' => $token,
        ]);
    }
}
