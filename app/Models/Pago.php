<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        // --- CONEXIONES DEL ECOSISTEMA ---
        'payment_plan_id',
        'stp_abono_id',

        // --- RELACIONES DE NEGOCIO ---
        'credito_id',
        'end_user_id',
        'cliente_id',

        // --- DATOS FINANCIEROS ---
        'monto_pago',
        'fecha_pago',

        // --- CONTROL Y AUDITORÍA ---
        'estatus',
        'clave_rastreo',
        'metodo_pago',
        'metadata_stp',
    ];

    // Para que Laravel maneje el JSON automáticamente
    protected $casts = [
        'metadata_stp' => 'array',
        'fecha_pago' => 'date',
    ];

    // --- RELACIONES ---

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }

    public function stpAbono()
    {
        return $this->belongsTo(StpAbono::class);
    }

    public function credito()
    {
        return $this->belongsTo(Credito::class);
    }

    public function endUser()
    {
        return $this->belongsTo(EndUser::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
