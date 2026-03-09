<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_plans', function (Blueprint $table) {
            $table->id();

            // Relaciones y Seguimiento
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('cuenta_beneficiario');
            $table->string('referencia_contrato')->nullable();

            // Datos de Originación
            $table->decimal('valor_total_vehiculo', 15, 2);
            $table->decimal('enganche_pagado', 15, 2)->default(0);
            $table->integer('meses_enganche')->default(1); // Nuevo campo
            $table->decimal('comision_apertura', 15, 2)->default(0);
            $table->decimal('cargo_gps', 10, 2)->default(0)->nullable();
            $table->decimal('cargo_seguro', 10, 2)->default(0)->nullable();

            $table->decimal('monto_final_financiado', 15, 2);
            $table->integer('plazo_credito_meses'); // Nuevo

            // Datos de la Mensualidad
            $table->integer('numero_pago');
            $table->integer('total_pagos');
            $table->decimal('monto_normal', 15, 2);
            $table->decimal('monto_pronto_pago', 15, 2);

            // Fechas
            $table->date('fecha_vencimiento');
            $table->date('fecha_limite_habil');

            // Estado y Control de Pagos
            // ANTES TENÍA UN PUNTO (.), AHORA LA FLECHA (->) CORRECTA:
            $table->enum('estado', ['pendiente', 'pagado', 'atrasado', 'parcial'])->default('pendiente');

            $table->decimal('monto_pagado_acumulado', 15, 2)->default(0);
            $table->timestamp('fecha_pago_real')->nullable();

            $table->timestamps();

            $table->index('cuenta_beneficiario');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_plans');
    }
};
