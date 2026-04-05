import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, Calendar, Activity, ArrowDownLeft, TrendingUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const Conciliacion = () => {
    const [data, setData] = useState({
        stats: { total_recibido: 0, pagos_validados: 0, por_conciliar: 0 },
        chartData: [],
        recentPayments: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchReportData(); }, []);

    const fetchReportData = async () => {
        try {
            const res = await api.get('/client/reporte-conciliacion');
            setData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1, scale: 1,
            transition: { staggerChildren: 0.1, duration: 0.5, ease: "easeOut" }
        }
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#f0f4f8]">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Zap className="text-[#0c516e]" size={48} fill="#0c516e" />
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial="hidden" animate="visible" variants={containerVariants}
            className="p-8 bg-[#f0f4f8] min-h-screen font-sans overflow-hidden"
        >
            {/* GLASS HEADER - FULL WIDTH EDITION */}
            <div className="mb-12 w-full space-y-8">
                <motion.div variants={cardVariants} className="w-full">

                    {/* LÍNEA 1: BADGE Y TÍTULO (100% ANCHO) */}
                    <div className="w-full mb-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                            </div>
                            <span className="text-[11px] font-black text-[#0c516e] uppercase tracking-[0.4em]">
                                Sincronización Bancaria en Tiempo Real
                            </span>
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none w-full">
                            Koon <span className="text-[#0c516e]">System</span>
                        </h1>
                    </div>

                    {/* LÍNEA 2: PÁRRAFO EXPANDIDO (100% ANCHO) */}
                    <div className="w-full pb-8 border-b border-slate-200">
                        <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-none">
                            <span className="text-slate-800 font-bold tracking-tight">Integración y Concentrado de Pagos</span>.
                            Gestión automatizada de liquidaciones y monitoreo de dispersión masiva bajo el protocolo
                            <span className="bg-slate-100 px-3 py-1 rounded text-[#0c516e] font-black text-xs ml-2 uppercase">STP Engine v2.4</span>.
                        </p>
                    </div>

                    {/* LÍNEA 3: STATUS BAR (DISTRIBUIDA ABAJO) */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pt-8 w-full">

                        <div className="flex flex-wrap items-center gap-12 flex-1">
                            {/* Gateway */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#051d26] flex items-center justify-center shadow-xl shadow-blue-900/20 text-white">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conexión Bancaria</span>
                                    <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">Directo Link SPEI</span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Activity size={12} className="text-teal-500" />
                                        <span className="text-[10px] font-black text-teal-600 uppercase">Sincronizado</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-12 w-[1px] bg-slate-200 hidden xl:block"></div>

                            {/* Uptime */}
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Servicio en Línea</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-slate-800 tracking-tighter">Operando 24/7</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-md border border-emerald-100 uppercase">Optimal</span>
                                </div>
                            </div>

                            <div className="h-12 w-[1px] bg-slate-200 hidden xl:block"></div>

                            {/* Encryption */}
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">infraestructura financiera</span>
                                <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">AES-256 GCM</span>
                            </div>
                        </div>

                        {/* Fecha Flotante Estilizada */}
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-6 bg-white p-4 pr-8 rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-50"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#0c516e]">
                                <Calendar size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Corte de Caja</span>
                                <span className="text-md font-black text-slate-800 uppercase tracking-tight">
                                    {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* KPI 3D CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <StatCard
                    title="Ingresos Totales"
                    value={data.stats.total_recibido}
                    icon={<DollarSign size={28} />}
                    accent="#0c516e"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* GRÁFICA PROYECTADA */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-[20px_20px_60px_#d1d9e6, -20px_-20px_60px_#ffffff] border border-white/20 relative overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Análisis de Flujo Semanal</h3>
                        <TrendingUp size={18} className="text-emerald-500" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData}>
                                <defs>
                                    <linearGradient id="bar3d" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0c516e" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#279a94" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 15 }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '10px 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="monto" fill="url(#bar3d)" radius={[12, 12, 12, 12]} barSize={40}>
                                    {data.chartData.map((entry, index) => (
                                        <Cell key={index} className="hover:filter hover:brightness-125 transition-all duration-300" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* ÚLTIMOS MOVIMIENTOS - LISTA FLOTANTE */}
                <motion.div
                    variants={cardVariants}
                    className="bg-[#051d26] p-10 rounded-[3rem] shadow-[20px_20px_60px_#d1d9e6] text-white flex flex-col relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h3 className="text-[11px] font-normal text-blue-200/50 uppercase tracking-[0.3em] mb-8">Movimientos Live</h3>
                        <div className="space-y-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar-white">
                            {data.recentPayments.map((pago, i) => (
                                <motion.div
                                    key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-[#0c516e] transition-all duration-500">
                                            <ArrowDownLeft size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-light tracking-tight leading-none mb-1">{pago.nombre_ordenante}</p>
                                            <p className="text-[9px] font-bold text-blue-300/60 uppercase">{pago.fecha}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-normal text-emerald-400 tracking-tighter">+${pago.monto.toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    {/* Efecto decorativo de fondo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                </motion.div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ title, value, icon, accent }) => (
    <motion.div
        variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
        whileHover={{ scale: 1.02, rotateY: 5 }}
        className="bg-white p-10 rounded-[3rem] shadow-[20px_20px_60px_#d1d9e6, -20px_-20px_60px_#ffffff] flex items-center justify-between group cursor-default border border-white/50"
    >
        <div className="space-y-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                <span className="text-[#0c516e]">$</span>{value.toLocaleString()}
            </h2>
        </div>
        <div className="w-20 h-20 rounded-[2rem] bg-[#f0f4f8] text-[#0c516e] flex items-center justify-center shadow-[inset_5px_5px_10px_#d1d9e6, inset_-5px_-5px_10px_#ffffff] group-hover:text-emerald-500 transition-colors duration-500">
            {icon}
        </div>
    </motion.div>
);

export default Conciliacion;