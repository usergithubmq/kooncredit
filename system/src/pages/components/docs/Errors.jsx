import React from 'react';
import { AlertCircle, History, ChevronLeft, HelpCircle } from 'lucide-react';

export const Errors = () => {
    return (
        <div className="prose prose-slate max-w-none animate-in fade-in duration-700">
            {/* Encabezado Principal */}
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-red-400" size={18} />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Gestión de Status</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-6 text-[#0c516e]">
                Errores
            </h1>

            <p className="text-[16px] leading-relaxed text-slate-600 mb-10">
                Denar utiliza códigos de estado HTTP estándar para comunicar el resultado de una solicitud a la API. En general, los códigos en el rango <span className="text-emerald-600 font-bold">2xx</span> indican éxito, los códigos en el rango <span className="text-amber-600 font-bold">4xx</span> indican un error por parte del cliente y los códigos en el rango <span className="text-red-600 font-bold">5xx</span> indican un error en los servidores de Denar.
            </p>

            {/* Tabla de Códigos - Estilo Limpio y Ancho */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-12 shadow-sm">
                <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Códigos de estado comunes
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse m-0">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-48">Código</th>
                                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Significado</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px]">
                            <tr className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-[#0c516e]">200 – OK</td>
                                <td className="px-6 py-4 text-slate-600">La solicitud tuvo éxito.</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-[#0c516e]">400 – Bad Request</td>
                                <td className="px-6 py-4 text-slate-600">La solicitud era inaceptable, a menudo debido a la falta de un parámetro requerido.</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-[#0c516e]">401 – Unauthorized</td>
                                <td className="px-6 py-4 text-slate-600">No se proporcionó una clave de API válida.</td>
                            </tr>
                            <tr className="border-b border-slate-100 hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-[#0c516e]">404 – Not Found</td>
                                <td className="px-6 py-4 text-slate-600">El recurso solicitado no existe.</td>
                            </tr>
                            <tr className="hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-[#0c516e]">429 – Too Many Requests</td>
                                <td className="px-6 py-4 text-slate-600">Demasiadas solicitudes golpeando la API con demasiada rapidez.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bloque de Ayuda - Estilo Banner unificado con Idempotencia/Metadatos */}
            <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden mb-12 shadow-sm">
                <div className="px-4 py-2 border-b border-blue-100 bg-blue-100/30 flex items-center gap-2 text-[11px] font-bold text-[#0c516e] uppercase tracking-wider">
                    <HelpCircle size={14} /> ¿Sigues teniendo problemas?
                </div>
                <div className="p-8 text-[15px] text-slate-600 leading-relaxed">
                    <p className="m-0">
                        Si recibes un error <strong className="text-red-600">5xx</strong> persistente, revisa nuestro panel de estado o contacta a soporte técnico mencionando tu identificador de solicitud (<code className="bg-white px-1.5 py-0.5 rounded border border-blue-100 text-[#0c516e] font-bold">X-Request-Id</code>).
                    </p>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-12">
                <History size={14} /> Actualizado hace 9 meses
            </div>

            {/* Navegación de pie de página */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <button className="group flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all font-medium">
                    <span className="text-sm">← Idempotencia</span>
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fin de documentación</span>
                    <div className="h-2 w-2 bg-[#4bb8b3] rounded-full shadow-[0_0_10px_rgba(75,184,179,0.5)]"></div>
                </div>
            </div>
        </div>
    );
};