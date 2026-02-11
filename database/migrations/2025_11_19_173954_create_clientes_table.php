<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('tipo_cliente', ['persona', 'empresa']);
            $table->string('rfc')->nullable();
            $table->string('nombre_legal')->nullable();
            $table->string('nombre_comercial')->nullable();

            $table->unsignedInteger('antiguedad_meses')->nullable();
            $table->decimal('ingresos_mensuales', 10, 2)->nullable();
            $table->string('sector')->nullable();

            // mejor un enum
            $table->enum('estatus', ['incompleto', 'en_revision', 'aprobado', 'rechazado'])
                ->default('incompleto');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
