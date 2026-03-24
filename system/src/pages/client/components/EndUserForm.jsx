import React, { useState } from "react";
import {
    FaSearch, FaSpinner, FaCalculator, FaCheckCircle, FaUserShield,
    FaIdCard, FaEnvelope, FaHashtag, FaMapMarkerAlt, FaMoneyBillWave,
    FaBuilding, FaFileInvoice, FaHistory
} from "react-icons/fa";
import api, { authApi } from "../../../api/axios";

function InputField({ label, value, onChange, icon, type = "number" }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm font-bold text-[#0c516e] focus:border-teal-500 focus:bg-white outline-none transition-all"
            />
        </div>
    );
}

export default function EndUserForm({ onUserCreated }) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [tempData, setTempData] = useState(null);
    const [formData, setFormData] = useState({
        document_value: "", // Ahora será el RFC
        email: "",
        referencia_interna: "",
        monto_normal: 0,
        moratoria: 0,
    });

    // Regex para RFC (Persona Física y Moral)
    const rfcRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;

    const handleValidate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.get('/sanctum/csrf-cookie', { withCredentials: true });
            const res = await api.post("/client/validate-pagador", {
                type: "RFC", // Cambiado de CURP a RFC
                value: formData.document_value
            });

            // Estructura según el JSON de Nubarium SAT que pasaste
            setTempData(res.data.data);
            setStep(2);
        } catch (err) {
            if (err.response?.status === 422) {
                // Esto te dirá: "El correo electrónico ya ha sido registrado."
                const validationErrors = err.response.data.errors;
                const firstMessage = Object.values(validationErrors)[0][0];
                alert("Validación: " + firstMessage);
            } else {
                alert("Error: " + (err.response?.data?.message || "Error al procesar"));
            }
        } finally { setLoading(false); }
    };

    const handleConfirmAndCreate = async () => {
        setLoading(true);
        try {
            const idData = tempData?.datosIdentificacion;

            // 1. Crear el Pagador (EndUser)
            const res = await api.post("/client/end-users", {
                name: idData?.nombres || tempData?.nombre_o_razon_social || "Usuario",
                first_last: idData?.apellidoPaterno || "",
                second_last: idData?.apellidoMaterno || "",
                email: formData.email,
                referencia_interna: formData.referencia_interna, // <--- SE ENVÍA TU REFERENCIA REAL
                document_value: formData.document_value // RFC
            });

            // IMPORTANTE: Laravel devuelve la data en res.data.data (según el último controlador)
            const newPagador = res.data.data;

            // 2. Generar el Plan de Pago usando los IDs reales que devolvió el servidor
            await api.post("/client/plan-pago/generar", {
                user_id: newPagador.user_id, // El ID del usuario recién creado
                cuenta_beneficiario: newPagador.clabe_stp, // La CLABE generada
                referencia_contrato: formData.referencia_interna,
                monto_normal: Number(formData.monto_normal),
                moratoria: Number(formData.moratoria),
                estado: 'pendiente'
            });

            alert("✅ ¡Éxito! Pagador y Plan de Pago creados correctamente.");
            resetForm();
            if (onUserCreated) onUserCreated();
        } catch (err) {
            console.error("Error completo:", err.response?.data);
            alert("Error: " + (err.response?.data?.error || "Error al procesar"));
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setStep(1);
        setFormData({ document_value: "", email: "", referencia_interna: "", monto_normal: 0, moratoria: 0 });
        setTempData(null);
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-teal-500/10 shadow-2xl mb-10 overflow-hidden">
            {step === 1 ? (
                <form onSubmit={handleValidate} className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                        <h3 className="text-md font-medium text-[#0c516e] flex items-center gap-2 uppercase tracking-tighter">
                            <FaUserShield className="text-teal-500" /> Registro Fiscal de Pagador
                        </h3>
                        <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-3 py-1 rounded-full uppercase tracking-widest">Paso 1: Validación SAT</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase flex items-center gap-2"><FaIdCard /> RFC</label>
                            <input
                                required
                                type="text"
                                maxLength={13}
                                placeholder="RFC con Homoclave"
                                value={formData.document_value}
                                onChange={e => setFormData({ ...formData, document_value: e.target.value.toUpperCase() })}
                                className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${rfcRegex.test(formData.document_value) ? "border-slate-100 focus:border-teal-500" : "border-red-100"}`}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase flex items-center gap-2"><FaEnvelope /> Email de la App</label>
                            <input
                                required
                                type="email"
                                placeholder="correo@cliente.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="p-4 rounded-2xl border-2 border-slate-100 text-sm focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-medium text-slate-400 uppercase flex items-center gap-2"><FaHashtag /> Referencia Contrato</label>
                            <input
                                type="text"
                                placeholder="Ejem: CON-123"
                                value={formData.referencia_interna}
                                onChange={e => setFormData({ ...formData, referencia_interna: e.target.value })}
                                className="p-4 rounded-2xl border-2 border-slate-100 text-sm focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button disabled={loading} className="w-full md:w-auto float-right bg-[#0c516e] text-white px-12 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-[#0a435c] transition-all shadow-lg">
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />} CONSULTAR NUBARIUM SAT
                    </button>
                </form>
            ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    {/* Header Enriquecido con datos de Nubarium */}
                    <div className="bg-gradient-to-r from-[#0c516e] to-[#146c91] p-6 rounded-[1.5rem] mb-8 text-white shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-5 relative z-10 mb-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                <FaCheckCircle className="text-teal-300" size={30} />
                            </div>
                            <div>
                                <p className="text-teal-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Estatus SAT: {tempData?.datosIdentificacion?.situacionContribuyente || 'OK'}</p>
                                <h4 className="text-xl font-black">
                                    {tempData?.datosIdentificacion?.nombres} {tempData?.datosIdentificacion?.apellidoPaterno} {tempData?.datosIdentificacion?.apellidoMaterno}
                                </h4>
                                <p className="text-[10px] opacity-70 font-mono">{tempData?.rfc} | CIF: {tempData?.cif}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 relative z-10">
                            <div className="text-[10px] font-bold text-teal-200 uppercase flex items-center gap-2">
                                <FaMapMarkerAlt /> {tempData?.datosUbicacion?.colonia}, {tempData?.datosUbicacion?.municipioDelegacion}, CP {tempData?.datosUbicacion?.cp}
                            </div>
                            <div className="text-[10px] font-bold text-teal-200 uppercase flex items-center gap-2">
                                <FaBuilding /> RÉGIMEN: {tempData?.caracteristicasFiscales?.[0]?.regimen || 'GENERAL'}
                            </div>
                        </div>
                    </div>

                    {/* CONFIGURACIÓN FINANCIERA */}
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8">
                        <h5 className="text-[#0c516e] font-black text-xs mb-6 uppercase flex items-center gap-2 tracking-widest">
                            <FaCalculator className="text-teal-500" /> Configuración de Pagos
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputField
                                label="Monto Mensual"
                                icon={<FaMoneyBillWave className="text-teal-500" />}
                                value={formData.monto_normal}
                                onChange={v => setFormData({ ...formData, monto_normal: v })}
                            />
                            <InputField
                                label="Recargo por Moratoria"
                                icon={<FaMoneyBillWave className="text-red-400" />}
                                value={formData.moratoria}
                                onChange={v => setFormData({ ...formData, moratoria: v })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-6 items-center">
                        <button onClick={() => setStep(1)} className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">← Cambiar RFC</button>
                        <button onClick={handleConfirmAndCreate} disabled={loading} className="bg-teal-600 text-white px-12 py-4 rounded-2xl font-black text-sm hover:bg-teal-700 shadow-lg active:scale-95 transition-all">
                            {loading ? <FaSpinner className="animate-spin" /> : "GENERAR ACCESO Y CLABE STP"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}