<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'credito_id',
        'monto_pago',
        'fecha_pago',
        'estatus',
    ];

    public function credito()
    {
        return $this->belongsTo(Credito::class);
    }
}
