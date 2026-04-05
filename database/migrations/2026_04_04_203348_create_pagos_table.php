<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            // --- CONEXIONES DEL ECOSISTEMA (VITALES) ---

            // Relación con el Plan de Pagos (La "Promesa" de cobro en DENAR)
            $table->foreignId('payment_plan_id')
                ->nullable()
                ->constrained('payment_plans')
                ->nullOnDelete();

            // Relación con el Abono crudo (La "Evidencia" en el Dispatcher)
            $table->foreignId('stp_abono_id')
                ->nullable()
                ->constrained('stp_abonos')
                ->nullOnDelete();

            // --- RELACIONES DE NEGOCIO ---

            $table->foreignId('credito_id')
                ->nullable()
                ->constrained('creditos')
                ->cascadeOnDelete();

            $table->foreignId('end_user_id')
                ->nullable()
                ->constrained('end_users')
                ->nullOnDelete();

            $table->foreignId('cliente_id')
                ->nullable()
                ->constrained('clientes')
                ->nullOnDelete();

            // --- DATOS FINANCIEROS (ESTANDARIZADOS) ---
            $table->decimal('monto_pago', 15, 2);
            $table->date('fecha_pago');

            // --- CONTROL Y AUDITORÍA ---
            $table->enum('estatus', [
                'registrado',
                'confirmado',
                'reversado',
            ])->default('registrado');

            $table->string('clave_rastreo')->nullable()->unique();
            $table->string('metodo_pago')->default('SPEI');
            $table->json('metadata_stp')->nullable();

            $table->timestamps();

            // --- ÍNDICES DE RENDIMIENTO ---
            $table->index('fecha_pago');
            $table->index('estatus');
            $table->index('clave_rastreo'); // Para búsquedas ultra rápidas de aclaraciones
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
