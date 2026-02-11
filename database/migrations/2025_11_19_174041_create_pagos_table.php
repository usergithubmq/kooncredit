<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('credito_id')->constrained('creditos')->cascadeOnDelete();

            $table->decimal('monto_pago', 10, 2);
            $table->date('fecha_pago');

            $table->enum('estatus', [
                'registrado',
                'confirmado',
                'reversado',
            ])->default('registrado');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
