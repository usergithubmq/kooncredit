import React, { useState, useEffect } from "react";
import {
    FaTimes, FaUniversity, FaSpinner, FaReceipt, FaCreditCard,
    FaCheckCircle, FaClock, FaStore, FaShieldAlt, FaCopy,
    FaExclamationTriangle, FaArrowLeft, FaLock, FaPrint, FaBarcode, FaRegFilePdf
} from "react-icons/fa";
import api from "../../../api/axios";

// --- HELPERS ---
const formatCLABE = (clabe) => clabe ? clabe.replace(/(\d{3})(\d{3})(\d{11})(\d{1})/, "$1 $2 $3 $4") : "--- --- ----------- -";
const formatMXN = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

export default function BalanceModal({ isOpen, onClose, user }) {
    const [view, setView] = useState("pago"); // "pago", "tarjeta", "efectivo"
    const [abonos, setAbonos] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const clabe = user?.clabe_stp || user?.cuenta_beneficiario;
        if (isOpen && clabe) {
            fetchData(clabe);
            setView("pago");
        }
    }, [isOpen, user]);

    const fetchData = async (clabe) => {
        setLoading(true);
        try {
            const [resAbonos, resSaldo] = await Promise.all([
                api.get(`/client/stp/abonos/${clabe}`),
                api.post(`/client/consultar-pago`, { cuenta_beneficiario: clabe })
            ]);
            setAbonos(resAbonos.data.data || []);
            setResumen(resSaldo.data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">

            {/* ESTILOS DE IMPRESIÓN DINÁMICOS */}
            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    #ticket-print, #ticket-print * { visibility: visible; }
                    #ticket-print { 
                        position: fixed; 
                        left: 0; 
                        top: 0; 
                        width: 100vw !important; 
                        height: auto;
                        padding: 40px !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .no-print { display: none !important; }
                }
                `}
            </style>

            <div className="bg-[#d3e0e5] w-70 max-w-4xl rounded-[3rem] overflow-hidden flex flex-col max-h-[95vh] border border-white/20 animate-in fade-in zoom-in-95">

                {/* Header Dinámico */}
                <div className="bg-gradient-to-r from-[#051d26] to-[#04364b] p-10 text-white flex justify-between items-center transition-all no-print">
                    <div className="flex items-center gap-5">
                        {view !== "pago" && (
                            <button onClick={() => setView("pago")} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                                <FaArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h3 className="text-2xl font-normal uppercase tracking-tight leading-none">
                                {view === "pago" ? user.name : view === "tarjeta" ? "Pago con Tarjeta" : "Ficha de Efectivo"}
                            </h3>
                            <p className="text-[10px] text-teal-300 font-medium tracking-[0.2em] mt-1 uppercase">
                                {view === "pago" ? "Gestión de Saldo Real-Time" : "Transacción Encriptada AES-256"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-500/20 rounded-2xl transition-all"><FaTimes size={24} /></button>
                </div>

                <div className="overflow-y-auto p-8 space-y-3 bg-slate-50/30">

                    {view === "pago" && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[11px] font-medium uppercase text-slate-400 tracking-widest mb-1">Total Acumulado</p>
                                    <p className="text-3xl font-normal text-[#57c2ce]">{formatMXN(resumen?.monto_acumulado)}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                    <p className="text-[11px] font-medium uppercase text-red-400 tracking-widest mb-1">Cargos Extra</p>
                                    <p className="text-3xl font-normal text-red-600">{formatMXN(resumen?.moratoria)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                <div className="bg-gradient-to-r from-[#051d26] to-[#04364b] rounded-[2.5rem] p-6 text-white shadow-xl">
                                    <div className="flex justify-between mb-8">
                                        <FaUniversity className="text-[#57c2ce]" size={24} />
                                        <button onClick={() => { navigator.clipboard.writeText(user.clabe_stp); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                                            <FaCopy className={copied ? "text-teal-400" : "text-slate-600"} />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">CLABE SPEI</p>
                                    <p className="text-[12px] font-mono text-blue-100 tracking-wider">{formatCLABE(user.clabe_stp)}</p>
                                </div>

                                <button onClick={() => setView("efectivo")} className="bg-white border-2 border-[#0c516e] rounded-[2.5rem] p-6 hover:border-[#4bb8b3] transition-all text-left group">
                                    <FaStore className="text-[#57c2ce] mb-8 transition-transform group-hover:scale-125" size={24} />
                                    <p className="text-[9px] text-[#0c516e] uppercase tracking-widest">Puntos de Pago</p>
                                    <p className="text-[12px] font-bold text-[#57c2ce]">EFECTIVO</p>
                                </button>

                                <button onClick={() => setView("tarjeta")} className="bg-gradient-to-r from-[#051d26] to-[#04364b]  rounded-[2.5rem] p-6 text-white hover:shadow-2xl transition-all text-left group">
                                    <FaCreditCard className="text-teal-400 mb-8 transition-transform group-hover:scale-125" size={24} />
                                    <p className="text-[9px] text-white/50 uppercase tracking-widest">Pago en Línea</p>
                                    <p className="text-[12px] font-bold text-white">TARJETA</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {view === "tarjeta" && (
                        <div className="max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 pb-6">

                            {/* 2. Formulario de Pago de Alto Contraste */}
                            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-5 relative">

                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2 text-[#0c516e]">
                                        <FaLock size={12} className="text-emerald-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Pago Seguro 256-bit</span>
                                    </div>
                                    <div className="flex gap-3 opacity-60 scale-90">
                                        <span className="text-[10px] font-black text-slate-400">VISA</span>
                                        <span className="text-[10px] font-black text-slate-400">MC</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input: Nombre */}
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Titular de la Tarjeta</label>
                                        <input
                                            type="text"
                                            placeholder="NOMBRE COMPLETO"
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#0c516e] focus:ring-0 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-300 transition-all uppercase"
                                        />
                                    </div>

                                    {/* Input: Número */}
                                    <div className="flex flex-col gap-1.5 md:col-span-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de Tarjeta</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#0c516e] outline-none text-base font-mono font-bold text-slate-900 placeholder:text-slate-300 transition-all"
                                            />
                                            <FaCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        </div>
                                    </div>

                                    {/* Vencimiento */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Vencimiento</label>
                                        <input
                                            type="text"
                                            placeholder="MM / AA"
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#0c516e] outline-none text-center font-bold text-slate-900"
                                        />
                                    </div>

                                    {/* CVC */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">CVC / CVV</label>
                                        <input
                                            type="password"
                                            placeholder="***"
                                            className="h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#0c516e] outline-none text-center font-bold text-lg text-slate-900 tracking-[0.3em]"
                                        />
                                    </div>
                                </div>

                                {/* 3. Footer de Acción */}
                                <div className="pt-4 space-y-4">
                                    <div className="flex justify-between items-end px-1">
                                        <div>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Total a Pagar</p>
                                            <p className="text-xl font-black text-[#0c516e] leading-none">{formatMXN(resumen?.monto_acumulado)}</p>
                                        </div>
                                        <p className="text-[8px] text-slate-300 font-mono">REF: {user.referencia_interna || 'K-PAY'}</p>
                                    </div>

                                    <button className="w-full bg-[#0c516e] hover:bg-slate-900 text-white py-4 rounded-xl font-black text-[10px] tracking-[0.15em] uppercase shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-2">
                                        <FaLock size={10} className="text-teal-400" /> PAGAR AHORA
                                    </button>

                                    <p className="text-center mt-6 text-[9px] text-slate-400 font-medium px-10 leading-relaxed uppercase tracking-tighter">
                                        Al presionar confirmar, autorizas a <span className="text-slate-600 font-bold">{user.nombre_comercial || user.name}</span> a realizar el cargo único. Tus datos nunca se guardan en nuestros servidores.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "efectivo" && (
                        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
                            {/* CONTENEDOR DE LA FICHA IMPRIMIBLE */}
                            <div id="ticket-print" className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-hidden">
                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200 no-print"></div>
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-200 no-print"></div>

                                <div className="text-center">
                                    <div className="flex justify-center gap-4 mb-6">
                                        <div className="h-10 w-24 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 grayscale">OXXO</div>
                                        <div className="h-10 w-24 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 grayscale">PAYNET</div>
                                    </div>

                                    <FaBarcode className="text-slate-800 mx-auto mb-4 opacity-80" size={80} />
                                    <h5 className="text-2xl font-normal text-[#0c516e] mb-1 italic tracking-tight uppercase">Ficha de Depósito</h5>
                                    {/* Nombre dinámico basado en el usuario actual */}
                                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-8 font-medium italic">
                                        {user.nombre_comercial || user.name || user.nombre || "Cliente DANER"}
                                    </p>
                                    <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-[#0c516e]/10 mb-8">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-bold">Número de Referencia</p>
                                        <p className="text-4xl font-mono font-bold text-[#0c516e] tracking-[0.1em] break-all">
                                            {user.referencia_interna || "GEN-99281-X"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-left border-t border-b border-slate-100 py-6 mb-6">
                                        <div>
                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Concepto</p>
                                            <p className="text-xs font-medium text-slate-700">Pago - {user.name || "USERDANER"}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Monto Sugerido</p>
                                            <p className="text-xs font-bold text-emerald-600">{formatMXN(resumen?.monto_acumulado)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 text-left bg-blue-50/50 p-4 rounded-2xl">
                                        <FaExclamationTriangle className="text-blue-500 mt-1" size={14} />
                                        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                                            Instrucciones: Indicar al cajero "Pago de Servicio" y proporcionar la referencia.
                                            Reflejo automático en 5-15 min.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 no-print">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 bg-white border-2 border-slate-200 text-slate-600 py-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                                >
                                    <FaPrint size={18} className="text-[#0c516e]" /> IMPRIMIR TICKET
                                </button>
                                <button
                                    className="flex-1 bg-[#0c516e] text-white py-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl active:scale-95"
                                >
                                    <FaRegFilePdf size={18} className="text-teal-400" /> DESCARGAR PDF
                                </button>
                            </div>
                        </div>
                    )}

                    {view === "pago" && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
                            <h5 className="font-bold text-slate-800 flex items-center gap-3 text-xs uppercase tracking-[0.3em] mb-8">
                                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></div> Bitácora de Movimientos
                            </h5>
                            <div className="space-y-4 italic">
                                {abonos.length > 0 ? abonos.map(a => (
                                    <div key={a.id} className="flex justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-teal-200 transition-all">
                                        <p className="text-sm font-bold text-slate-700">{a.concepto_pago || 'Abono Recibido'}</p>
                                        <p className="text-emerald-600 font-bold">{formatMXN(a.monto)}</p>
                                    </div>
                                )) : <p className="text-center text-[10px] text-slate-300 uppercase tracking-widest py-10">Esperando transacciones...</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}