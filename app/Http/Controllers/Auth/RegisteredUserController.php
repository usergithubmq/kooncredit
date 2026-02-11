<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Twilio\Rest\Client;

class RegisteredUserController extends Controller
{
    /**
     * Registrar usuario y enviar código OTP por SMS (Twilio Verify)
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'person_type'     => ['string', 'max:255'],
            'name'     => ['string', 'max:255'],
            'first_last'     => ['string', 'max:255'],
            'second_last'     => ['string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone'    => ['required', 'string', 'min:10'],
            'password' => ['required', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response([
                'errors' => $validator->errors(),
            ], 422);
        }

        // Normalizar teléfono (+52...)
        $phone = preg_replace('/\D+/', '', $request->phone);

        if (!str_starts_with($phone, '52')) {
            $phone = '52' . $phone;
        }
        $phone = '+' . $phone;

        // Crear usuario
        $user = User::create([
            'person_type'     => $request->person_type,
            'name'     => $request->name,
            'first_last'     => $request->first_last,
            'second_last'     => $request->second_last,
            'email'    => strtolower($request->email),
            'phone'    => $phone,
            'password' => Hash::make($request->password),
            'role'     => 'cliente',
        ]);

        event(new Registered($user));

        // Enviar OTP via Twilio Verify
        $twilio = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));

        $twilio->verify->v2
            ->services(env('TWILIO_VERIFY_SID'))
            ->verifications
            ->create($phone, "sms");

        return response([
            'message' => 'Usuario registrado. Código enviado por SMS.',
            'user_id' => $user->id,
            'phone'   => $user->phone,
        ], 201);
    }
}
