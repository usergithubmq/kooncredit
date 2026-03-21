<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes - KoonSystem
|--------------------------------------------------------------------------
*/

// Rutas para invitados (Guest)
Route::middleware('guest')->group(function () {
    // Login
    Route::post('/login', [LoginController::class, 'login'])
        ->name('login');

    // Registro
    Route::post('/register', [RegisterController::class, 'register'])
        ->name('register');

    // Recuperación de contraseña
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Rutas que requieren estar logueado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
});
