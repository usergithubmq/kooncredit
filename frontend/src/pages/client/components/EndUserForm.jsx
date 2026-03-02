import React, { useState } from "react";
import { FaSearch, FaCheckCircle, FaSpinner, FaUndo, FaIdCard, FaBuilding, FaUser } from "react-icons/fa";
import api from "../../../api/axios";

export default function EndUserForm({ onUserCreated }) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [tempData, setTempData] = useState(null);
    const [docType, setDocType] = useState("RFC");
    const [formData, setFormData] = useState({
        document_value: "",
        email: "",
        referencia_interna: ""
    });

    const handleValidate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/client/validate-pagador", {
                type: docType,
                value: formData.document_value.toUpperCase().trim()
            });

            let responseData = res.data;

            // Limpiador por si el servidor envía ruido (Deprecated warnings)
            if (typeof res.data === 'string') {
                const jsonStart = res.data.indexOf('{"success"');
                if (jsonStart !== -1) {
                    responseData = JSON.parse(res.data.substring(jsonStart));
                }
            }

            if (responseData && responseData.data) {
                setTempData(responseData.data);
                setStep(2);
            } else {
                alert("Error: La respuesta del servidor no tiene el formato esperado.");
            }
        } catch (err) {
            alert(err.response?.data?.error || "Error de conexión al validar.");
        } finally { setLoading(false); }
    };

    const handleConfirmAndCreate = async () => {
        setLoading(true);
        try {
            // Solo enviamos lo que tu Modelo EndUser acepta en $fillable
            await api.post("/client/end-users", {
                name: tempData?.official_name,
                email: formData.email,
                referencia_interna: formData.referencia_interna
            });

            alert("✅ Registro completo y cuenta STP generada.");
            resetForm();
            if (onUserCreated) onUserCreated();
        } catch (err) {
            alert(err.response?.data?.error || "Error al registrar el pagador.");
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({ document_value: "", email: "", referencia_interna: "" });
        setTempData(null);
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-teal-500/10 shadow-2xl mb-10 transition-all overflow-hidden">
            {step === 1 ? (
                <form onSubmit={handleValidate} className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-[#0c516e] flex items-center gap-2 uppercase tracking-tighter">
                            <FaSearch className="text-teal-500" /> Validación de Identidad
                        </h3>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {["RFC", "CURP"].map((t) => (
                                <button key={t} type="button" onClick={() => setDocType(t)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${docType === t ? 'bg-white text-[#0c516e] shadow-sm' : 'text-slate-400'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{docType} del Pagador</label>
                            <input required type="text" value={formData.document_value}
                                onChange={e => setFormData({ ...formData, document_value: e.target.value })}
                                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder={`Ingresa ${docType}...`} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email (Notificaciones)</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="correo@cliente.com" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref. Interna</label>
                            <input type="text" value={formData.referencia_interna} onChange={e => setFormData({ ...formData, referencia_interna: e.target.value })}
                                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ej: Contrato-001" />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full md:w-auto float-right bg-[#0c516e] text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-[#0a435c] transition-all flex items-center justify-center gap-3 shadow-lg">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />} CONSULTAR Y VALIDAR
                    </button>
                    <div className="clear-both"></div>
                </form>
            ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-gradient-to-r from-teal-50 to-white border border-teal-100 p-8 rounded-[2rem] flex items-center gap-8 mb-8">
                        <div className={`p-6 rounded-full text-4xl shadow-inner ${tempData?.person_type === 'Moral' ? 'bg-purple-100 text-purple-600' : 'bg-teal-100 text-teal-600'}`}>
                            {tempData?.person_type === 'Moral' ? <FaBuilding /> : <FaUser />}
                        </div>
                        <div className="flex-1">
                            <span className="bg-teal-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                                Persona {tempData?.person_type || 'Detectada'}
                            </span>
                            <h4 className="text-2xl font-black text-slate-800 mt-2 uppercase tracking-tight break-words leading-tight">
                                {tempData?.official_name}
                            </h4>
                            <p className="text-slate-500 font-mono text-sm mt-1">{formData.document_value.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-end gap-6 items-center">
                        <button onClick={() => setStep(1)} className="text-slate-400 font-bold hover:text-slate-600 uppercase text-xs tracking-widest transition-colors flex items-center gap-2">
                            <FaUndo /> Corregir Datos
                        </button>
                        <button onClick={handleConfirmAndCreate} disabled={loading} className="w-full md:w-auto bg-teal-600 text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-teal-700 shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                            {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} CONFIRMAR Y CREAR CUENTA STP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}