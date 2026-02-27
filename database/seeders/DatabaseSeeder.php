<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EndUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EndUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Aseguramos que exista un Cliente (Empresa) para asociar al usuario
        // Si ya tienes clientes, puedes omitir este paso o usar uno existente
        $clienteId = DB::table('clientes')->insertGetId([
            'nombre_comercial' => 'Empresa Demo CDMX',
            'rfc' => 'DEMO123456A1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Creamos el Usuario Pagador (EndUser)
        EndUser::create([
            'cliente_id' => $clienteId,
            'name' => 'Milton Pagador Demo',
            'email' => 'pago@demo.com',
            'password' => Hash::make('12345678'), // Tu contraseña para el login
            'clabe_stp' => '646180' . str_pad(rand(0, 999999999999), 12, '0', STR_PAD_LEFT),
            'referencia_interna' => 'EXP-2026-001',
            'is_active' => true,
        ]);

        $this->command->info('Usuario demo creado: pago@demo.com / 12345678');
    }
}
