import React from 'react';
import { History, ChevronRight, HelpCircle, Fingerprint } from 'lucide-react';

export const RequestIdentifiers = () => {
    return (
        <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
            {/* Encabezado Principal */}
            <div className="flex items-center gap-2 mb-4">
                <Fingerprint className="text-[#4bb8b3]" size={18} />
                <span className="text-[10px] font-black text-[#4bb8b3] uppercase tracking-[0.3em]">Trazabilidad</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-[#0c516e]">
                Identificadores de solicitud
            </h1>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-8">
                Cada solicitud a la API tiene un identificador único asociado. Este valor se devuelve mediante los encabezados de respuesta y tiene el nombre <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-xs font-bold text-[#0c516e]">X-Request-Id</code>.
            </p>

            {/* Bloque de Encabezado - Estilo exacto a Introducción */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
                <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Ejemplo de encabezado de respuesta
                </div>
                <div className="p-6 font-mono text-sm text-slate-800">
                    <span className="text-[#4bb8b3] font-bold">X-Request-Id:</span> req_01H2PX9967D8YJ2Z5K9W...
                </div>
            </div>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-10">
                Recomendamos almacenar estos identificadores en sus propios registros de base de datos para facilitar la conciliación en caso de discrepancias o auditorías.
            </p>

            {/* Bloque de Ayuda - Estilo Banner Horizontal */}
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden mb-12 shadow-sm">
                <div className="px-4 py-2 border-b border-blue-100 bg-blue-100/30 flex items-center gap-2 text-[11px] font-bold text-[#0c516e] uppercase tracking-wider">
                    <HelpCircle size={14} /> Soporte Técnico
                </div>
                <div className="p-8 text-[15px] text-slate-600 leading-relaxed">
                    <p className="m-0">
                        ¿Necesitas ayuda con una operación específica? <strong className="text-[#0c516e]">Envíenos el identificador de la solicitud</strong>.
                        Nuestro equipo de ingeniería lo utiliza para localizar el log exacto en el nodo y resolver su incidencia lo antes posible.
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-12">
                <History size={14} /> Actualizado hace 9 meses
            </div>

            {/* Navegación de pie de página */}
            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button className="group flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-medium">
                    <span className="text-sm">← Paginación</span>
                </button>
                <button className="group flex items-center gap-2 text-slate-600 hover:text-black transition-all">
                    <span className="text-sm font-medium">Metadatos</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-black transition-all" />
                </button>
            </div>
        </div>
    );
};