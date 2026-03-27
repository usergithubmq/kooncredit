<?php

// 1. Cargamos el corazón de Laravel
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Mail\BienvenidoPagadorMail;
use Illuminate\Support\Facades\Mail;

// 2. Definimos los datos (Nombre y Contraseña temporal)
$datos = [
    'nombre'   => 'Milton Quiroz',
    'empresa'  => 'Alianza S.A de C.V',
    'password' => 'QUHM971222SD2' // La que verás en el mail
];

echo "🚀 Intentando enviar correo a Mailtrap...\n";

try {
    // Usamos ->send() para que sea instantáneo y no dependa del worker
    Mail::to('milton.quiroz@bluelife.network')->send(new BienvenidoPagadorMail($datos));

    echo "✅ ¡ÉXITO! Revisa tu 'Arenero' en Mailtrap ahora mismo.\n";
} catch (\Exception $e) {
    echo "❌ ERROR AL ENVIAR: " . $e->getMessage() . "\n";
}
