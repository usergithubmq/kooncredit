<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentPlan extends Model
{
    use HasFactory;

    protected $table = 'payment_plans';

    protected $fillable = [
        'user_id',
        'cuenta_beneficiario',
        'referencia_contrato',
        'valor_total_vehiculo',
        'enganche_pagado',
        'meses_enganche',
        'comision_apertura',
        'cargo_gps',
        'cargo_seguro',
        'monto_final_financiado',
        'plazo_credito_meses',
        'numero_pago',
        'total_pagos',
        'monto_normal',
        'monto_pronto_pago',
        'fecha_vencimiento',
        'fecha_limite_habil',
        'estado',
        'monto_pagado_acumulado',
        'fecha_pago_real'
    ];

    protected $casts = [
        'fecha_vencimiento'      => 'date',
        'fecha_limite_habil'     => 'date',
        'fecha_pago_real'        => 'datetime',
        'valor_total_vehiculo'   => 'float',
        'enganche_pagado'        => 'float',
        'meses_enganche'         => 'integer',
        'comision_apertura'      => 'float',
        'cargo_gps'              => 'float',
        'cargo_seguro'           => 'float',
        'monto_final_financiado' => 'float',
        'plazo_credito_meses'    => 'integer',
        'monto_normal'           => 'float',
        'monto_pronto_pago'      => 'float',
        'monto_pagado_acumulado' => 'float',
        'numero_pago'            => 'integer',
        'total_pagos'            => 'integer',
    ];

    /**
     * Relación: Un plan de pago pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
