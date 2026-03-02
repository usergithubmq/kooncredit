<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class EndUser extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'cliente_id',

        'name',
        'email',
        'referencia_interna',
        'clabe_stp',
        'is_active',
    ];

    /* ====================
       RELACIONES
       ==================== */

    /**
     * El pagador pertenece a un Cliente específico.
     */
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
