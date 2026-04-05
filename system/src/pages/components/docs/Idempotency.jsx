import React from 'react';
import { ShieldCheck, History, ChevronLeft, ChevronRight } from 'lucide-react';

export const Idempotency = () => {
    return (
        <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
            {/* Encabezado Principal */}
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-[#0c516e]">
                Idempotencia
            </h1>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-6">
                La API de Denar admite la idempotencia para reintentar las solicitudes de forma segura, evitando realizar la misma operación dos veces por error. Esto resulta útil al crear <span className="text-[#4bb8b3] font-medium border-b border-[#4bb8b3]/20">cargos</span>, <span className="text-[#4bb8b3] font-medium border-b border-[#4bb8b3]/20">intenciones de pago</span> o <span className="text-[#4bb8b3] font-medium border-b border-[#4bb8b3]/20">transferencias</span>.
            </p>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-8">
                Si se produce un error de conexión al crear un objeto junto con una clave de idempotencia, puede repetir la solicitud de forma segura sin riesgo de crear un segundo objeto.
            </p>

            <div className="space-y-4 mb-10">
                <p className="text-[16px] leading-relaxed text-slate-600">
                    Para realizar una solicitud idempotente, proporcione una cabecera adicional a la solicitud:
                    <code className="ml-2 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs font-bold text-[#0c516e]">
                        Idempotency-Key: &lt;idempotency-key-value&gt;
                    </code>
                </p>
                <p className="text-[16px] leading-relaxed text-slate-600">
                    Sugerimos usar <strong className="text-slate-900">UUID V4</strong>. Las claves pueden tener hasta 255 caracteres.
                </p>
            </div>

            {/* Bloque de Alerta - Estilo Banner unificado */}
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden mb-10 shadow-sm">
                <div className="px-4 py-2 border-b border-blue-100 bg-blue-100/30 flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    <ShieldCheck size={14} /> Seguridad y Autenticación
                </div>
                <div className="p-6 text-[15px] text-blue-900/80 leading-relaxed">
                    Si la solicitud entrante falla la autenticación, no se guarda ningún resultado idempotente porque ningún punto final de la API ha comenzado su ejecución.
                </div>
            </div>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-8">
                Todas las solicitudes <code className="text-[#4bb8b3] font-bold">POST</code> aceptan claves de idempotencia. El envío de claves en <code className="text-slate-400">GET</code> y <code className="text-slate-400">DELETE</code> no tiene efecto.
            </p>

            {/* Bloque de Código con Pestañas - Estilo Introducción */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-12 shadow-sm">
                <div className="flex border-b border-slate-200 bg-slate-100/50">
                    <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black bg-white border-r border-slate-200">cURL</button>
                    <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-200">Python</button>
                    <button className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Node.js</button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed text-slate-800">
                    <pre className="m-0 p-0 bg-transparent border-none">
                        {`curl --request POST "https://api.denar.network/v1/charges" \\
  --header 'Authorization: sk_live_0000000000000000' \\
  --header 'Content-Type: application/json' \\
  --header 'Idempotency-Key: 31a0dd22-38e4-4392-81e1-aa3a2018b48d' \\
  --data-raw '{
    "amount": 10000,
    "currency": "mxn"
  }'`}
                    </pre>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-12">
                <History size={14} /> Actualizado hace 9 meses
            </div>

            {/* Navegación de pie de página */}
            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button className="group flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-medium">
                    <span className="text-sm">← Metadatos</span>
                </button>
                <button className="group flex items-center gap-2 text-slate-600 hover:text-black transition-all font-medium">
                    <span className="text-sm">Errores</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-black transition-all" />
                </button>
            </div>
        </div>
    );
};