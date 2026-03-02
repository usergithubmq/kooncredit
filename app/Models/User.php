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
        'name',
        'first_last',
        'second_last',
        'email',
        'role',
        'password',
        'phone',
        'phone_verification_code',
        'phone_verified_at',
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

    /* ====================
       RELACIONES
       ==================== */

    /**
     * Un Usuario (con rol cliente) tiene un perfil de Cliente.
     */
    public function cliente()
    {
        return $this->hasOne(Cliente::class);
    }
}
