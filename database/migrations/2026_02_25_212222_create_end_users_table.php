<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('end_users', function (Blueprint $table) {
            $table->id();

            // Relación con la tabla 'clientes' (la empresa que recibe el crédito)
            // Usamos 'cascade' para que si se borra la empresa, se limpien sus usuarios.
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');

            // Datos de identidad del usuario final
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');

            // Datos específicos para el flujo de STP
            // Aquí guardarás la CLABE única que STP le asigne a este usuario específico
            $table->string('clabe_stp', 18)->nullable()->unique();
            $table->string('referencia_interna')->nullable(); // Ej: Número de contrato o expediente

            // Estado de la cuenta del usuario
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes(); // Recomendado para no perder historial financiero por error
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('end_users');
    }
};
