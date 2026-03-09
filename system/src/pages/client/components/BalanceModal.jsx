import React, { useState, useEffect } from "react";
import {
    FaTimes, FaArrowDown, FaUniversity, FaSpinner, FaReceipt,
    FaCar, FaCheckCircle, FaClock, FaStore, FaMoneyBillWave
} from "react-icons/fa";
import api from "../../../api/axios";

// --- SUB-COMPONENTE: MODAL DE FORMULARIO DE COBRO ---
const CashPaymentForm = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 relative animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                    <FaTimes size={16} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FaStore size={30} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800">Pago en Efectivo</h4>
                    <p className="text-slate-500 text-sm">Genera tu referencia de pago</p>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Monto a Pagar (MXN)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                            <input type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-8 text-lg font-black text-[#0c516e] outline-none focus:border-amber-400 transition-all" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Establecimiento</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['OXXO', '7-Eleven', 'Walmart', 'Farmacias'].map((store) => (
                                <button key={store} className="p-3 rounded-xl border-2 border-slate-100 text-xs font-bold text-slate-600 hover:border-[#0c516e] hover:bg-slate-50 transition-all focus:bg-[#0c516e] focus:text-white">
                                    {store}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="w-full bg-[#0c516e] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                        <FaReceipt /> GENERAR REFERENCIA
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function BalanceModal({ isOpen, onClose, user }) {
    const [abonos, setAbonos] = useState([]);
    const [resumenPlan, setResumenPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCashModal, setShowCashModal] = useState(false); // ESTADO PARA EL SUB-MODAL

    const formatMXN = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

    const breakdown = abonos.reduce((acc, curr) => {
        const tipo = curr.tipo_pago || 'Transferencia';
        acc[tipo] = (acc[tipo] || 0) + parseFloat(curr.monto);
        return acc;
    }, {});

    useEffect(() => {
        if (isOpen && user?.clabe_stp) fetchData();
    }, [isOpen, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resAbonos = await api.get(`/client/stp/abonos/${user.clabe_stp}`);
            setAbonos(resAbonos.data.data || []);
            const resPlan = await api.get(`/client/plan-pago/resumen/${user.clabe_stp}`);
            setResumenPlan(resPlan.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    const saldoReal = abonos.reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
    const proximo = resumenPlan?.proximo_pago;
    const stats = resumenPlan?.stats;
    const hoy = new Date();
    const esProntoPago = proximo ? hoy <= new Date(proximo.fecha_limite_habil) : false;
    const comisionPagada = proximo ? saldoReal >= parseFloat(proximo.comision_apertura) : false;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <div className="bg-[#0c516e] p-6 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl"><FaCar size={24} className="text-teal-300" /></div>
                            <div>
                                <h3 className="text-xl font-bold">{user.name || user.nombre}</h3>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><FaTimes size={20} /></button>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar">
                        {/* 1. Resumen Financiero */}
                        {proximo && (
                            <div className="px-6 pt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { label: 'Vehículo', val: proximo.valor_total_vehiculo },
                                    { label: 'Financiado', val: parseFloat(proximo.valor_total_vehiculo) - parseFloat(proximo.enganche_pagado) },
                                    { label: 'Comisión Apertura', val: proximo.comision_apertura, isComision: true },
                                    { label: 'Cargo GPS', val: proximo.cargo_gps },
                                    { label: 'Cargo Seguro', val: proximo.cargo_seguro },
                                    { label: 'Enganche', val: proximo.enganche_pagado },
                                ].map((item, i) => (
                                    <div key={i} className={`p-3 rounded-xl border transition-all ${item.isComision ? (comisionPagada ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200') : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex justify-between items-start">
                                            <p className={`text-[9px] font-black uppercase ${item.isComision ? (comisionPagada ? 'text-emerald-600' : 'text-amber-600') : 'text-slate-400'}`}>{item.label}</p>
                                            {item.isComision && (comisionPagada ? <FaCheckCircle className="text-emerald-500 text-[10px]" /> : <FaClock className="text-amber-500 text-[10px]" />)}
                                        </div>
                                        <p className={`text-sm font-bold ${item.isComision ? (comisionPagada ? 'text-emerald-700' : 'text-amber-700') : 'text-slate-700'}`}>{formatMXN(item.val)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. Progreso del Crédito */}
                        {resumenPlan && stats && (
                            <div className="p-6 pb-2">
                                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                                    <div className="flex justify-between items-center mb-4 text-xs font-black text-slate-400 uppercase">
                                        <span>Progreso de Mensualidades</span>
                                        <span className="text-teal-600">{stats.progreso_porcentaje}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-teal-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.progreso_porcentaje}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. OPCIONES DE PAGO (Botones Interactivos) */}
                        <div className="px-6 py-4">
                            <div className="bg-[#0c516e] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                                <div className="relative z-10">
                                    <h5 className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Opciones de Pago</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Botón SPEI (Informativo) */}
                                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                            <div className="bg-teal-500/20 p-3 rounded-xl text-teal-400"><FaUniversity size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">SPEI</p>
                                                <p className="text-xs font-mono font-bold text-white tracking-wider">{user.clabe_stp}</p>
                                            </div>
                                        </div>

                                        {/* Botón EFECTIVO (Abre Modal de Cobro) */}
                                        <button
                                            onClick={() => setShowCashModal(true)}
                                            className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-left group"
                                        >
                                            <div className="bg-amber-500/20 p-3 rounded-xl text-amber-400 group-hover:scale-110 transition-transform"><FaStore size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold text-white uppercase">Efectivo / Tiendas</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 p-8 opacity-10"><FaMoneyBillWave size={80} /></div>
                            </div>
                        </div>

                        {/* 4. Balance e Historial */}
                        <div className="px-6 pb-8">
                            <div className="flex justify-between items-center mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Saldo Total Recibido</p>
                                    <h4 className="text-2xl font-black text-[#0c516e]">{formatMXN(saldoReal)}</h4>
                                </div>
                                <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center"><FaReceipt size={20} /></div>
                            </div>

                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Distribución por Canal</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(breakdown).map(([tipo, total], idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">{tipo}</p>
                                            <p className="text-sm font-black text-[#0c516e]">{formatMXN(total)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h5 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-tighter">
                                <FaArrowDown className="text-teal-500" /> Historial de Abonos
                            </h5>
                            <div className="space-y-2">
                                {loading ? <div className="text-center py-6"><FaSpinner className="animate-spin inline text-teal-500" /></div> :
                                    abonos.length > 0 ? abonos.map((abono) => (
                                        <div key={abono.id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                                            <div>
                                                <p className="font-bold text-slate-700 text-xs">{abono.concepto_pago || 'Abono Recibido'}</p>
                                                <p className="text-[9px] text-slate-400">{new Date(abono.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-teal-600 font-black text-sm">{formatMXN(abono.monto)}</p>
                                        </div>
                                    )) : <p className="text-slate-400 text-xs text-center py-6 italic">Sin movimientos.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                        <button onClick={onClose} className="px-6 py-2 bg-[#0c516e] text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all">Cerrar</button>
                    </div>
                </div>
            </div>

            {/* MODAL DE COBRO EN EFECTIVO */}
            <CashPaymentForm
                isOpen={showCashModal}
                onClose={() => setShowCashModal(false)}
                user={user}
            />
        </>
    );
}