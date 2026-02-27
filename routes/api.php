<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PhoneVerificationController;
use App\Http\Controllers\Auth\EndUserController;
use App\Http\Controllers\Onboarding\LivenessController;
use App\Http\Controllers\Onboarding\IneController;


/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/

// Registro
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/send-code', [PhoneVerificationController::class, 'sendCode']);
Route::post('/verify-code', [PhoneVerificationController::class, 'verify']);
Route::post('/login', [LoginController::class, 'login']);

Route::prefix('end-user')->group(function () {
    Route::post('/register', [EndUserController::class, 'register']);
    Route::post('/login', [EndUserController::class, 'login']);
});

Route::middleware('auth:sanctum')->get('/end-user/profile', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Rutas protegidas por Sanctum
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout por token
    Route::post('/logout', [LoginController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Ruta para el dashboard
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/dashboard', function () {
    return response()->json(['message' => 'Dashboard OK']);
});

// Ruta protegida para obtener el historial (usando Sanctum)
Route::middleware('auth:sanctum')->get('/mis-pagos', function (Request $request) {
    return App\Models\Pago::where('end_user_id', $request->user()->id)->get();
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/onboarding/liveness', [LivenessController::class, 'store']);
    Route::get('/onboarding/liveness/status', [LivenessController::class, 'status']);
});

Route::middleware(['auth:sanctum'])->group(function () {

    // Subir INE
    Route::post('/onboarding/ine/upload', [IneController::class, 'upload']);

    // Procesar INE con OCR/IA simulada
    Route::post('/onboarding/ine/process', [IneController::class, 'process']);

    // Obtener estatus INE
    Route::get('/onboarding/ine/status', [IneController::class, 'status']);
});
