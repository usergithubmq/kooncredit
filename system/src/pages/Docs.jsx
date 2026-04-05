import React, { useState } from 'react';
import {
    Search,
    ChevronRight,
    BookOpen,
    Code2,
    History,
    ChevronDown,
    Command
} from 'lucide-react';

// Importamos el Header que diseñamos
import { DocsHeader } from './components/docs/DocsHeader';

// Componentes de contenido
import { Introduction } from './components/docs/Introduction';
import { Authentication } from './components/docs/Authentication';
import { RequestIdentifiers } from './components/docs/RequestIdentifiers';
import { Metadata } from './components/docs/Metadata';
import { Idempotency } from './components/docs/Idempotency';
import { Errors } from './components/docs/Errors';

const Docs = () => {
    const [activeTab, setActiveTab] = useState('Introducción');
    const [searchQuery, setSearchQuery] = useState('');

    // Función que intercambia el bloque principal
    const renderContent = () => {
        switch (activeTab) {
            case 'Introducción': return <Introduction />;
            case 'Autenticación': return <Authentication />;
            case 'Identificadores de solicitud': return <RequestIdentifiers />;
            case 'Metadatos': return <Metadata />;
            case 'Solicitudes idempotentes': return <Idempotency />;
            case 'Errores': return <Errors />;
            default: return <Introduction />;
        }
    };

    const menuItems = [
        'Introducción',
        'Autenticación',
        'Identificadores de solicitud',
        'Metadatos',
        'Solicitudes idempotentes',
        'Errores'
    ];

    // Filtrado lógico para el buscador del sidebar
    const filteredItems = menuItems.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">

            {/* --- 1. HEADER PRINCIPAL (64px / h-16) --- */}
            <DocsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* --- 2. SUB-HEADER (Navegación Técnica) --- 
                Ajustado a top-16 (64px) para quedar justo debajo del main header
            */}
            <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 sticky top-16 bg-white/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-4 text-[13px] font-medium">
                    <button className="flex items-center gap-1 hover:bg-slate-50 px-2 py-1 rounded-md transition-all text-slate-600">
                        v2026-04-01 <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <button className="flex items-center gap-2 bg-slate-50 text-black px-3 py-1.5 rounded-md border border-slate-200 shadow-sm hover:border-[#4bb8b3]/30 transition-all">
                        <Code2 size={16} className="text-[#0c516e]" /> Referencia de la API
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* --- 3. SIDEBAR IZQUIERDO --- 
                    Sticky top-[112px] (Header 64px + SubHeader 48px)
                */}
                <aside className="w-64 border-r border-slate-100 h-[calc(100vh-112px)] sticky top-[112px] overflow-y-auto p-6 bg-white">
                    <div className="mb-8 relative">
                        <input
                            type="text"
                            placeholder="SALTAR A"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-md py-2 px-3 text-[10px] font-black tracking-widest outline-none focus:border-[#4bb8b3] transition-colors"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[9px] text-slate-400 font-bold">
                            <Command size={10} /> /
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-3 mb-4">API de Denar</h4>
                            <ul className="space-y-1">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <li
                                            key={item}
                                            onClick={() => setActiveTab(item)}
                                            className={`px-3 py-2 rounded-xl text-[13px] cursor-pointer transition-all duration-200 ${activeTab === item
                                                ? 'bg-cyan-50 text-cyan-600 font-bold shadow-sm shadow-cyan-900/5'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-black'
                                                }`}
                                        >
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-2 text-[11px] text-slate-400 italic">No hay resultados</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* --- 4. CONTENIDO PRINCIPAL --- */}
                <main className="flex-1 px-16 py-12 max-w-5xl">

                    {/* Contenedor con animación suave al cambiar de tab */}
                    <div className="min-h-[60vh]">
                        {renderContent()}
                    </div>

                    {/* Footer de navegación dinámico */}
                    <footer className="mt-24 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                        <div className="flex items-center gap-2 italic opacity-60">
                            <History size={12} /> Actualizado: Abril 2026
                        </div>
                        <div className="flex gap-8">
                            <button className="hover:text-cyan-500 transition-colors cursor-pointer">Anterior</button>
                            <button className="hover:text-cyan-500 transition-colors cursor-pointer text-[#0c516e]">Siguiente</button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Docs;