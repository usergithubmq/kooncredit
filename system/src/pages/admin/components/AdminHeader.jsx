import React, { useState, useEffect } from 'react';
import { FaTerminal, FaPlus, FaGlobe, FaClock, FaSignal } from "react-icons/fa";

const AdminHeader = ({ view, openModal }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    // Reloj técnico sincronizado
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-20 px-12 flex justify-between items-center bg-[#0d465b] backdrop-blur-md border-b border-slate-100 z-30 sticky top-0">

            <div className="flex items-center gap-10">
                {/* INDICADOR DE SECCIÓN */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#57c2ce] to-[#051d26] rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative w-10 h-10 bg-[#d4e1e6] rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
                            <FaTerminal className="text-[#2c2c2c] text-[10px]" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[7px] font-black tracking-[0.8em] text-white uppercase mb-1 leading-none">Terminal_ID: 0x2026</h2>
                        <h1 className="text-xs font-black text-[#d3e0e5] uppercase tracking-[0.2em] italic">
                            {view === 'dashboard' ? 'Métricas_Globales' :
                                view === 'list' ? 'Directorio_Nodos' : 'Gateway_Logs'}
                        </h1>
                    </div>
                </div>

                {/* TELEMETRÍA DE SISTEMA (Nueva Información) */}
                <div className="hidden xl:flex items-center gap-8 border-l border-slate-100 pl-10">
                    {/* Status Red */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#60e2ff] uppercase tracking-widest mb-1">Status de Network</span>
                        <div className="flex items-center gap-2">
                            <FaSignal className="text-[#279a94] text-[18px]" />
                            <span className="text-[11px] font-normal text-[#d3e0e5] font-mono">14ms_LATENCY</span>
                        </div>
                    </div>

                    {/* Server Time */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#60e2ff] uppercase tracking-widest mb-1">Hora Local</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-normal text-[#d3e0e5] font-mono uppercase">{time}</span>
                        </div>
                    </div>

                    {/* Region */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#60e2ff] uppercase tracking-widest mb-1">Region</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-normal text-[#d3e0e5] font-mono uppercase">Zone_MX_Central</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTÓN REGISTRAR */}
            <button
                onClick={openModal}
                className="group relative flex items-center gap-4 bg-[#d3e0e5] hover:bg-[#0d3544] px-6 py-3 rounded-2xl border border-slate-200 hover:border-[#60e2ff] transition-all duration-500 active:scale-95 overflow-hidden shadow-sm"
            >
                <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-[#051d26] group-hover:text-white transition-colors duration-500">
                    Nuevo_Registro
                </span>

                <div className="relative z-10 flex items-center justify-center w-5 h-5 rounded-md bg-[#051d26]/5 group-hover:bg-[#1e788d] transition-all duration-500">
                    <FaPlus className="text-[#000000] text-[8px] group-hover:rotate-90 transition-transform duration-500" />
                </div>

                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-[#15475a] transition-transform duration-500 ease-out z-0" />
            </button>
        </header>
    );
};

export default AdminHeader;