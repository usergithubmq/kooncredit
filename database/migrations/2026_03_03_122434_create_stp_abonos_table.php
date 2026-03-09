<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stp_abonos', function (Blueprint $table) {
            $table->id();
            // Campos principales de STP
            $table->unsignedBigInteger('stp_id')->unique(); // El "id" del JSON
            $table->integer('fecha_operacion'); // AAAAMMDD
            $table->integer('institucion_ordenante');
            $table->integer('institucion_beneficiaria');
            $table->string('clave_rastreo', 30);
            $table->decimal('monto', 19, 2);

            // Datos del Ordenante (Quien envía)
            $table->string('nombre_ordenante', 120)->nullable();
            $table->integer('tipo_cuenta_ordenante')->nullable();
            $table->string('cuenta_ordenante', 20)->nullable();
            $table->string('rfc_curp_ordenante', 18)->nullable();

            // Datos del Beneficiario (Tu cliente en Koon Finansen)
            $table->string('nombre_beneficiario', 40);
            $table->integer('tipo_cuenta_beneficiario');
            $table->string('cuenta_beneficiario', 20); // La CLABE asignada
            $table->string('rfc_curp_beneficiario', 18);

            // Datos secundarios / CODI
            $table->string('nombre_beneficiario2', 40)->nullable();
            $table->integer('tipo_cuenta_beneficiario2')->nullable();
            $table->string('cuenta_beneficiario2', 20)->nullable();

            // Referencias
            $table->string('concepto_pago', 40);
            $table->integer('referencia_numerica');
            $table->string('empresa', 15);
            $table->integer('tipo_pago');
            $table->string('ts_liquidacion', 20); // El timestamp en milisegundos
            $table->string('folio_codi', 40)->nullable();

            $table->timestamps();

            // Índice para búsquedas rápidas por Clave de Rastreo (Muy usado en conciliación)
            $table->index(['fecha_operacion', 'clave_rastreo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stp_abonos');
    }
};
