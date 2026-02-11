<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cliente_id',
        'monto',
        'plazo_meses',
        'motivo',
        'estatus',
    ];

    /* ====================
       RELACIONES
       ==================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function credito()
    {
        return $this->hasOne(Credito::class);
    }
}
