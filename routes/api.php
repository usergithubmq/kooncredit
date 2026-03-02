<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controladores
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\PhoneVerificationController;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Cliente\EndUserController; // Nuevo controlador para el Dashboard del Cliente
use App\Http\Controllers\Onboarding\LivenessController;
use App\Http\Controllers\Onboarding\IneController;

/*
|--------------------------------------------------------------------------
| API Routes - KoonSystem B2B
|--------------------------------------------------------------------------
*/

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);
Route::middleware('auth:sanctum')->group(function () {

    // 1. DASHBOARD SUPER ADMIN (Milton)
    Route::prefix('admin')->group(function () {
        Route::post('/clients', [ClientController::class, 'store']);
        Route::get('/clients', [ClientController::class, 'index']);
    });

    // 2. DASHBOARD CLIENTE (Empresas B2B)
    Route::prefix('client')->group(function () {
        Route::post('/validate-pagador', [EndUserController::class, 'validatePagador']);
        // Aquí es donde el Cliente crea a sus pagadores finales
        Route::post('/end-users', [EndUserController::class, 'store']);
        Route::get('/end-users', [EndUserController::class, 'index']);
        // Aquí pediremos las CLABEs STP
        Route::get('/payments', [EndUserController::class, 'getPayments']);
    });

    // 3. ONBOARDING (Validaciones)
    Route::prefix('onboarding')->group(function () {
        Route::post('/liveness', [LivenessController::class, 'store']);
        Route::post('/ine/upload', [IneController::class, 'upload']);
        Route::post('/phone/verify', [PhoneVerificationController::class, 'verify']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user()->load(['cliente']);
    });

    Route::post('/logout', [LoginController::class, 'logout']);
});
