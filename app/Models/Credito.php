<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credito extends Model
{
    use HasFactory;

    protected $fillable = [
        'solicitud_id',
        'user_id',
        'monto_aprobado',
        'plazo_meses',
        'tasa_interes',
        'fecha_desembolso',
        'estatus',
    ];

    /* ====================
       RELACIONES
       ==================== */

    public function solicitud()
    {
        return $this->belongsTo(Solicitud::class);
    }

    public function analista()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
