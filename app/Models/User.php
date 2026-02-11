<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'person_type',
        'name',
        'first_last',
        'second_last',
        'email',
        'password',
        'phone',
        'phone_verification_code',
        'phone_verified_at',
        'role',
        'liveness_verified',
        'ine_front_path',
        'ine_back_path',
        'ine_verified',
        'ine_name',
        'ine_curp',
        'ine_clave_elector',
        'ine_vigencia',
    ];


    protected $hidden = [
        'password',
        'remember_token',
        'phone_verification_code',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
