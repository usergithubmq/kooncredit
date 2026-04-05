import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserShield, FaArrowUp, FaWallet } from 'react-icons/fa';

const Estadisticas = () => {
    const metrics = [
        { label: 'Clientes', icon: <FaUsers size={14} />, color: 'from-[#051d26] to-[#0a3a4a]', accent: '#60e2ff' },
        { label: 'Usuarios Activos ', icon: <FaUserShield size={14} />, color: 'from-[#051d26] to-[#064e3b]', accent: '#10b981' },
        { label: 'Ingreso Mensual', icon: <FaArrowUp size={14} />, color: 'from-[#051d26] to-[#0a3a4a]', accent: '#60e2ff' },
        { label: 'Ingreso Total', icon: <FaArrowUp size={14} />, color: 'from-[#051d26] to-[#0a3a4a]', accent: '#60e2ff' },
        { label: 'Saldo Actual', icon: <FaWallet size={14} />, color: 'from-[#051d26] to-[#451a03]', accent: '#f59e0b' },
    ];

    return (

        <div className="relative z-10 flex flex-col gap-6">

            {/* GRID DE MÉTRICAS ULTRA-SLIM */}
            <div className="grid grid-cols-5 gap-4">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-gradient-to-br ${m.color} p-4 rounded-2xl border border-white/5 flex flex-col gap-3 relative overflow-hidden group`}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10" style={{ color: m.accent }}>
                                {m.icon}
                            </div>
                            <span className="text-[7px] font-black text-[#d3e0e5] uppercase tracking-widest">{m.label}</span>
                        </div>

                        {/* PLACEHOLDER COMPACTO */}
                        <div className="relative z-10 space-y-2">
                            <div className="h-6 w-2/3 bg-white/5 rounded-md animate-pulse" />
                            <div className="h-[2px] w-6 rounded-full" style={{ backgroundColor: m.accent }} />
                        </div>

                        {/* SCANNER DISCRETO */}
                        <motion.div
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 w-10 h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"
                        />
                    </motion.div>
                ))}
            </div>
        </div>


    );
};

export default Estadisticas;