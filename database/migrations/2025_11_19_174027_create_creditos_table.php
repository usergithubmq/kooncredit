<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('creditos', function (Blueprint $table) {
            $table->id();

            // solicitud de origen
            $table->foreignId('solicitud_id')->constrained('solicitudes')->cascadeOnDelete();

            // ejecutivo o usuario interno que gestionó
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->decimal('monto_aprobado', 10, 2);
            $table->unsignedInteger('plazo_meses');
            $table->decimal('tasa_interes', 5, 2)->default(36.00);

            $table->date('fecha_desembolso')->nullable();

            $table->enum('estatus', [
                'activo',
                'atrasado',
                'liquidado',
                'castigado'
            ])->default('activo');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creditos');
    }
};
