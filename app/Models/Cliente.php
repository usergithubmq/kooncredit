<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tipo_cliente',
        'rfc',
        'nombre_comercial',
        'antiguedad_meses',
        'ingresos_mensuales',
        'sector',
        'estatus',
    ];

    /* ====================
       RELACIONES
       ==================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function solicitudes()
    {
        return $this->hasMany(Solicitud::class);
    }
}
