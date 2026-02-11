<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {

            // Liveness
            $table->boolean('liveness_verified')->default(false);

            // INE
            $table->string('ine_front')->nullable();
            $table->string('ine_back')->nullable();
            $table->boolean('ine_verified')->default(false);

            // Dirección / comprobante
            $table->string('address_selfie')->nullable(); // foto sosteniendo comprobante o domicilio
            $table->boolean('address_verified')->default(false);

            // Datos obligatorios para crédito
            $table->string('curp')->nullable();
            $table->string('rfc')->nullable();
            $table->date('dob')->nullable(); // fecha de nacimiento

            // Estado del onboarding
            $table->enum('onboarding_status', [
                'pending_liveness',
                'pending_ine',
                'pending_address',
                'completed'
            ])->default('pending_liveness');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'liveness_verified',
                'ine_front',
                'ine_back',
                'ine_verified',
                'address_selfie',
                'address_verified',
                'curp',
                'rfc',
                'dob',
                'onboarding_status'
            ]);
        });
    }
};
