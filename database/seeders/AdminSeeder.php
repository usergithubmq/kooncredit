<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Admin: Milton Arturo
        User::create([
            'name'       => 'Milton Arturo',
            'first_last' => 'Quiroz',
            'second_last' => 'Hernández',
            'email'      => 'milton.quiroz@bluelife.network',
            'role'       => 'admin',
            'password'   => Hash::make('4dm1n5y5tem'),
        ]);

        // 2. Super Admin: Jesús Moises
        User::create([
            'name'       => 'Jesús Moises',
            'first_last' => 'Zamora',
            'second_last' => 'Ramirez',
            'email'      => 'moises.zamora@koonfinansen.com.mx',
            'role'       => 'admin',
            'password'   => Hash::make('4dm1n5y5tem'),
        ]);

        $this->command->info('Super Admins creados correctamente:');
        $this->command->info('- milton.quiroz@bluelife.network');
        $this->command->info('- moises.zamora@koonfinansen.com.mx');
    }
}
