import React from 'react';
import { History, ChevronRight, Info } from 'lucide-react';

export const Metadata = () => {
    return (
        <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
            {/* Encabezado Principal */}
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-[#0c516e]">
                Metadatos
            </h1>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-8">
                Algunos objetos de Denar (actualmente <span className="text-[#4bb8b3] font-medium">Cargos</span>, <span className="text-[#4bb8b3] font-medium">Sesiones de pago</span>, <span className="text-[#4bb8b3] font-medium">Enlaces de pago</span> y <span className="text-[#4bb8b3] font-medium">Transferencias</span>) tienen un parámetro de metadatos. Puede usar este parámetro para agregarles pares clave-valor personalizados.
            </p>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-8">
                Los metadatos son útiles para almacenar datos estructurados arbitrarios de los objetos con los que interactúa. Esto facilita la integración de su sistema con Denar. Por ejemplo, podría almacenar el nombre completo del usuario y su identificador único correspondiente en un objeto de intención de pago.
                <br /><br />
                <strong className="text-slate-900">Denar no utiliza ni modifica los metadatos de ninguna manera.</strong>
            </p>

            {/* Bloque de Limitaciones - Estilo Banner (como el de Introducción) */}
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden mb-10 shadow-sm">
                <div className="px-4 py-2 border-b border-blue-100 bg-blue-100/30 flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    <Info size={14} /> Limitaciones
                </div>
                <div className="p-6 text-[15px] text-blue-900/80 leading-relaxed">
                    <ul className="list-none p-0 m-0 space-y-2">
                        <li>• Los metadatos pueden contener hasta <strong className="text-blue-900">50 claves</strong>.</li>
                        <li>• Nombres de claves de hasta <strong className="text-blue-900">40 caracteres</strong> y valores de hasta <strong className="text-blue-900">500 caracteres</strong>.</li>
                        <li>• Se permiten cadenas de texto, booleanos y números.</li>
                    </ul>
                </div>
            </div>

            {/* Bloque de Código - Estilo exacto al de Introducción */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-12 shadow-sm">
                <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Ejemplo de objeto con metadatos
                </div>
                <div className="p-6 font-mono text-sm text-slate-800 leading-relaxed">
                    <pre className="m-0 p-0 bg-transparent border-none text-slate-800">
                        {`{
  "amount": 10000,
  "currency": "mxn",
  "metadata": {
    "order_id": "ORD-67890",
    "customer_id": "USER_99",
    "internal_ref": "TXN_ALPHA"
  }
}`}
                    </pre>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-12">
                <History size={14} /> Actualizado hace 9 meses
            </div>

            {/* Navegación de pie de página */}
            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button className="group flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all">
                    <span className="text-sm font-medium">← Identificadores</span>
                </button>
                <button className="group flex items-center gap-2 text-slate-600 hover:text-black transition-all">
                    <span className="text-sm font-medium">Idempotencia</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-black transition-all" />
                </button>
            </div>
        </div>
    );
};