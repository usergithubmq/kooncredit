<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();

            // quién la creó (cliente)
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // referencia al perfil financiero
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();

            $table->decimal('monto', 10, 2);
            $table->unsignedInteger('plazo_meses');
            $table->text('motivo')->nullable();

            $table->enum('estatus', [
                'pendiente',
                'en_revision',
                'aprobada',
                'rechazada',
                'cancelada'
            ])->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
