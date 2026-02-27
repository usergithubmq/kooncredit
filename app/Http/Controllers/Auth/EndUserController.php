<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EndUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class EndUserController extends Controller
{
    /**
     * Registro de nuevo usuario pagador (EndUser)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:end_users'],
            'password' => ['required', 'min:8'],
            'cliente_id' => ['required', 'exists:clientes,id'],
        ]);

        $user = EndUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'cliente_id' => $request->cliente_id,
            // Generamos la CLABE de 18 dígitos para el control de STP
            'clabe_stp' => '646180' . str_pad(rand(0, 999999999999), 12, '0', STR_PAD_LEFT),
            'is_active' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Login para usuarios finales
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = EndUser::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas para el portal.'], 401);
        }

        $token = $user->createToken('portal_token')->plainTextToken;
        if (ob_get_length()) ob_clean();
        return response()->json([
            'access_token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'clabe_stp' => $user->clabe_stp,
                'cliente_id' => $user->cliente_id
            ]
        ]);
    }
}
