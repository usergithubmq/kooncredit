import React, { useState, useRef } from 'react';
import api from "../../api/axios";
import { motion } from "framer-motion";
import {
    FaCamera, FaSave, FaBuilding,
    FaCheckCircle, FaSpinner, FaLock, FaEye, FaEyeSlash
} from "react-icons/fa";

export default function ProfileView({ clienteInfo, onUpdate }) {
    // ESTADO PARA PERFIL
    const [profileData, setProfileData] = useState({
        nombre_comercial: clienteInfo?.nombre_comercial || '',
        nombre_legal: clienteInfo?.nombre_legal || clienteInfo?.nombre_comercial || '',
        rfc: clienteInfo?.rfc || '',
        logo: null
    });

    // ESTADO PARA PASSWORD
    const [passData, setPassData] = useState({
        password: '',
        password_confirmation: ''
    });

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [successProfile, setSuccessProfile] = useState(false);
    const [successPass, setSuccessPass] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fileInputRef = useRef(null);
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://app.koonfinansen.com.mx';
    const [preview, setPreview] = useState(clienteInfo?.logo_url ? `${baseUrl}/storage/${clienteInfo.logo_url}` : null);

    // Validación Password
    const checks = {
        length: passData.password.length >= 10,
        upper: /[A-Z]/.test(passData.password),
        number: /[0-9]/.test(passData.password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(passData.password),
        match: passData.password.length > 0 && passData.password === passData.password_confirmation
    };
    const isPassStrong = Object.values(checks).every(Boolean);

    // HANDLER PERFIL (Logo y Nombres) - CORREGIDO PARA MULTIPART
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);

        const data = new FormData();
        data.append('nombre_comercial', profileData.nombre_comercial);
        data.append('nombre_legal', profileData.nombre_legal);

        // Solo adjuntamos si es un archivo nuevo seleccionado
        if (profileData.logo instanceof File) {
            data.append('logo', profileData.logo);
        }

        try {
            // Es vital enviar el header multipart/form-data para que Laravel procese el archivo
            await api.post("/client/profile-update", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccessProfile(true);
            setTimeout(() => setSuccessProfile(false), 3000);
            if (onUpdate) onUpdate();
        } catch (err) {
            if (err.response?.status === 422) {
                console.error("Errores de Validación:", err.response.data.errors);
                const firstError = Object.values(err.response.data.errors)[0][0];
                alert("Error de validación: " + firstError);
            } else {
                alert("Error al actualizar: " + (err.response?.data?.message || "Error de servidor"));
            }
        } finally { setLoadingProfile(false); }
    };

    // HANDLER PASSWORD
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!isPassStrong) return alert("La contraseña no cumple los requisitos.");

        setLoadingPass(true);
        try {
            await api.post("/client/change-password", {
                password: passData.password,
                password_confirmation: passData.password_confirmation
            });
            setSuccessPass(true);
            setPassData({ password: '', password_confirmation: '' });
            setTimeout(() => setSuccessPass(false), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || "Error al actualizar contraseña.";
            alert(msg);
        } finally { setLoadingPass(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6 pt-10 pb-20 px-4">

            {/* --- BLOQUE 1: IDENTIDAD --- */}
            <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#0c516e] py-4 px-8 flex items-center gap-6">
                    <div className="relative group">
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden cursor-pointer flex items-center justify-center relative"
                        >
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Logo Preview" />
                            ) : (
                                <FaBuilding className="text-slate-200" size={30} />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                                <FaCamera size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="text-white">
                        <h2 className="text-xl font-normal uppercase tracking-tighter">Identidad Corporativa</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Configuración de Marca</p>
                    </div>
                </div>

                <div className="p-5 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-[#0c516e] transition-all"
                                value={profileData.nombre_comercial}
                                onChange={e => setProfileData({ ...profileData, nombre_comercial: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">RFC</label>
                            <input readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-400 font-mono text-xs font-bold" value={profileData.rfc} />
                        </div>
                        {/* Campo de Nombre Legal / Razón Social */}
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-normal text-slate-400 uppercase tracking-widest ml-1">Razón Social / Nombre Legal</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-sm outline-none focus:border-[#0c516e] transition-all"
                                value={profileData.nombre_legal}
                                onChange={e => setProfileData({ ...profileData, nombre_legal: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={loadingProfile} className="px-8 py-3 bg-[#279a94] text-white rounded-xl font-normal text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#0c516e] transition-all disabled:opacity-50">
                            {loadingProfile ? <FaSpinner className="animate-spin" /> : successProfile ? <><FaCheckCircle /> Guardado</> : <><FaSave /> Actualizar Perfil</>}
                        </button>
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setProfileData({ ...profileData, logo: file });
                            setPreview(URL.createObjectURL(file));
                        }
                    }}
                    className="hidden"
                    accept="image/*"
                />
            </form>

            {/* --- BLOQUE 2: SEGURIDAD --- */}
            <form onSubmit={handleUpdatePassword} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#0c516e] py-6 px-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"><FaLock size={18} /></div>
                    <div className="text-white">
                        <h2 className="text-xl font-normal uppercase tracking-tighter">Seguridad de Acceso</h2>
                        <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest">Protocolo de Cifrado</p>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[#0c516e]"
                                    value={passData.password}
                                    onChange={e => setPassData({ ...passData, password: e.target.value })}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none ${passData.password_confirmation ? (checks.match ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20') : 'border-slate-100'}`}
                                value={passData.password_confirmation}
                                onChange={e => setPassData({ ...passData, password_confirmation: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loadingPass || !isPassStrong}
                            className={`w-full py-4 rounded-xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg ${loadingPass || !isPassStrong ? 'bg-slate-200' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
                        >
                            {loadingPass ? <FaSpinner className="animate-spin m-auto" /> : successPass ? <><FaCheckCircle className="inline mr-2" /> Contraseña Actualizada</> : "Actualizar Credenciales"}
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Requisitos del Sistema</p>
                        <div className="grid grid-cols-2 gap-4">
                            <Requirement label="10+ Carac." met={checks.length} />
                            <Requirement label="Mayúscula" met={checks.upper} />
                            <Requirement label="Número" met={checks.number} />
                            <Requirement label="Símbolo" met={checks.symbol} />
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}

function Requirement({ label, met }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${met ? 'bg-emerald-500 shadow-md shadow-emerald-200' : 'bg-slate-200'}`}>
                {met && <FaCheckCircle className="text-white" size={10} />}
            </div>
            <span className={`text-[9px] font-bold uppercase ${met ? 'text-slate-700' : 'text-slate-300'}`}>{label}</span>
        </div>
    );
}