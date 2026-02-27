<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            // Relación con Créditos: nullable por si el pago es un abono general o servicio de análisis
            $table->foreignId('credito_id')
                ->nullable()
                ->constrained('creditos')
                ->cascadeOnDelete();

            // El usuario final que realiza el pago (Módulo 1)
            $table->foreignId('end_user_id')
                ->nullable()
                ->constrained('end_users')
                ->nullOnDelete();

            // La empresa dueña del cliente (Módulo 2 - Análisis)
            $table->foreignId('cliente_id')
                ->nullable()
                ->constrained('clientes')
                ->nullOnDelete();

            // Datos financieros
            $table->decimal('monto_pago', 10, 2);
            $table->date('fecha_pago');

            // Control de STP y Auditoría
            $table->enum('estatus', [
                'registrado',
                'confirmado',
                'reversado',
            ])->default('registrado');

            // Campos críticos para el servicio de análisis de pagos STP
            $table->string('clave_rastreo')->nullable()->unique()->comment('ID único de la transferencia en STP');
            $table->string('metodo_pago')->default('SPEI');
            $table->json('metadata_stp')->nullable()->comment('Copia del webhook recibido para auditoría');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
