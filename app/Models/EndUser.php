<?php

namespace App\Models;

// Importamos las clases necesarias para autenticación y tokens
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class EndUser extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'cliente_id',
        'name',
        'email',
        'password',
        'clabe_stp',
        'referencia_interna',
        'is_active',
    ];

    /**
     * Los atributos que deben ocultarse para los arrays (seguridad).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deben ser casteados.
     */
    protected $casts = [
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // --- RELACIONES ---

    /**
     * Relación con la Empresa (Cliente de KoonFinansen).
     * Un usuario final pertenece a una empresa cliente.
     */
    public function empresa()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relación con los Pagos.
     * Un usuario final puede tener muchos pagos registrados.
     */
    public function pagos()
    {
        return $this->hasMany(Pago::class, 'end_user_id');
    }
}
