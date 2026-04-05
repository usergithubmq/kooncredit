import React from 'react';
import { Search, ChevronDown, Command, Activity, Globe, Code2 } from 'lucide-react';

// Añadimos searchQuery y setSearchQuery como props
export const DocsHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="sticky top-0 z-[100] w-full bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between">
            {/* IZQUIERDA: Identidad Denar */}
            <div className="flex items-center gap-8">
                <a href="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-[#051d26] rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(75,184,179,0.4)] transition-all duration-300">
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-black text-xl tracking-tighter text-[#051d26]">denar</span>
                </a>

                <div className="h-6 w-[1px] bg-slate-100 hidden md:block"></div>

                {/* Versión y Status */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-black transition-colors uppercase tracking-widest">
                        v2.0.4 <ChevronDown size={12} />
                    </button>
                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-md">
                        <Activity size={10} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">NETWORK</span>
                    </div>
                </div>
            </div>

            {/* CENTRO: Buscador Global - AHORA FUNCIONAL */}
            <div className="hidden lg:flex items-center relative group max-w-md w-full px-12">
                <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={14} />
                <input
                    type="text"
                    value={searchQuery} // <-- Conectado al estado
                    onChange={(e) => setSearchQuery(e.target.value)} // <-- Actualiza el estado al escribir
                    placeholder="Buscar en la documentación..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-12 text-[13px] outline-none focus:bg-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                    <Command size={10} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400">K</span>
                </div>
            </div>

            {/* DERECHA: Acciones Rápidas */}
            <div className="flex items-center gap-6">
                <nav className="hidden xl:flex items-center gap-6 border-r border-slate-100 pr-6 mr-2">
                    <button className="text-[11px] font-black text-slate-400 hover:text-[#0c516e] uppercase tracking-widest transition-colors">API Reference</button>
                    <button className="text-[11px] font-black text-slate-400 hover:text-[#0c516e] uppercase tracking-widest transition-colors">Soporte</button>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-black transition-colors">
                        <Globe size={18} />
                    </button>
                    <a
                        href="/login"
                        className="bg-[#051d26] text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl hover:bg-cyan-500 hover:shadow-[0_10px_20px_rgba(75,184,179,0.2)] transition-all duration-300"
                    >
                        Consola
                    </a>
                </div>
            </div>
        </header>
    );
};