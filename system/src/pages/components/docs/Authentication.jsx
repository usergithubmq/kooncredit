import React from 'react';
import { ShieldAlert, Terminal, Lock, ChevronRight, History } from 'lucide-react';

export const Authentication = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Encabezado de Sección */}
            <header className="mb-10">
                <h1 className="text-4xl font-black text-[#0c516e] tracking-tighter mb-4">Autenticación</h1>
                <p className="text-[15px] leading-relaxed text-slate-600 max-w-2xl">
                    Denar utiliza claves API para autenticar las solicitudes. Estas claves, llamadas claves secretas, otorgan privilegios de escritura y lectura en tu nodo, ¡así que asegúrate de mantenerlas a salvo! 👮‍♂️
                </p>
            </header>

            {/* Bloque de Código Principal (cURL) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={12} /> Solicitud autenticada
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">bash</span>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed text-slate-800 overflow-x-auto">
                    <span className="text-slate-400">curl</span> --request GET https://api.denar.network/v1/links \
                    <br />
                    <span className="text-slate-400">--header</span> <span className="text-amber-600">"Authorization: Bearer sk_test_9c8d8CeyBTx1VcJzuDgpm4H..."</span>
                </div>
            </div>

            <p className="text-[15px] leading-relaxed text-slate-600 mb-8">
                La API espera que cada solicitud se autentique con una clave secreta a través del encabezado: <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-xs font-bold text-[#0c516e]">Authorization</code>. No compartas tus claves secretas en lugares públicos como repositorios de GitHub o código que se ejecute en el lado del cliente.
            </p>

            {/* Bloque de Referencia Rápida */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-10">
                <div className="px-5 py-3 border-b border-slate-200 bg-slate-100/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Encabezado HTTP
                </div>
                <div className="p-6 font-mono text-sm text-[#0c516e] font-bold">
                    Authorization: <span className="text-slate-400 font-medium tracking-tight">YOUR_SECRET_KEY</span>
                </div>
            </div>

            {/* Alerta de Importancia */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mb-12 flex gap-4">
                <div className="mt-1">
                    <ShieldAlert className="text-amber-500" size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Importante</h4>
                    <p className="text-[14px] leading-relaxed text-amber-800/80">
                        Todas las solicitudes a la API deben realizarse mediante <strong className="text-amber-900">HTTPS</strong>. Las solicitudes mediante HTTP simple fallarán. Las solicitudes no autenticadas también fallarán automáticamente.
                    </p>
                </div>
            </div>

            {/* Metadatos y Navegación */}
            <footer className="flex flex-col gap-8">
                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                    <History size={14} /> Actualizado hace 2 meses
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                    <button className="text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-widest transition-colors">
                        ← Introducción
                    </button>
                    <button className="group flex items-center gap-2 text-[#0c516e] hover:text-black transition-all">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Paginación</span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-[#0c516e] transition-all" />
                    </button>
                </div>
            </footer>
        </div>
    );
};