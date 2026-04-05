import React from 'react';
import { ChevronRight, History } from 'lucide-react'; // Importa todos los que uses

export const Introduction = () => (
    <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-black tracking-tighter mb-6">Introducción</h1>
        <p className="text-slate-600">¡Bienvenido a Denar! 👋 Aquí encontrarás todo lo que necesitas para usar nuestra API...</p>
        <p className="text-[15px] leading-relaxed text-slate-600 mb-8">
            ¡Respondemos rápido! ⚡
        </p>

        {/* Bloque de URL Base */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-8">
            <div className="px-4 py-2 border-b border-slate-200 bg-slate-100/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">URL base</div>
            <div className="p-6 font-mono text-sm text-slate-800">
                https://api.denar.network
            </div>
        </div>

        <p className="text-[15px] leading-relaxed text-slate-600 mb-8">
            La API de Denar es una API <span className="text-[#4bb8b3] font-medium">REST</span>. Devuelve únicamente respuestas <span className="text-[#4bb8b3] font-medium">JSON</span> con <span className="text-[#4bb8b3] font-medium">códigos HTTP</span> para indicar éxito o fracaso. Cada solicitud debe incluir el encabezado establecido en <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-xs">Content-Type: application/json</code>.
        </p>

        <div className="flex items-center gap-2 text-slate-400 text-xs mb-12">
            <History size={14} /> Actualizado hace 2 minutos
        </div>

        {/* Navegación de pie de página */}
        <div className="flex justify-end pt-8 border-t border-slate-100">
            <button className="group flex items-center gap-2 text-slate-600 hover:text-black transition-all">
                <span className="text-sm font-medium">Autenticación</span>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-black transition-all" />
            </button>
        </div>
    </div>
);