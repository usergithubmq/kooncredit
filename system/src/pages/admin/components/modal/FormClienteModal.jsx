import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBuilding, FaUserTie, FaCheckCircle, FaShieldAlt, FaFingerprint } from 'react-icons/fa';

const FormClienteModal = ({ isOpen, onClose, formData, setFormData, handleSubmit, loading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                {/* Overlay con Blur profundo */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#051d26]/50 backdrop-blur-xl"
                />

                {/* Contenedor del Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    className="relative w-full max-w-6xl bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[600px]"
                >
                    {/* COLUMNA IZQUIERDA: Identidad Denar */}
                    <div className="w-full md:w-[35%] bg-[#051d26] p-16 flex flex-col justify-between relative overflow-hidden">
                        {/* Decoración de fondo sutil */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#57c2ce] opacity-[0.03] rounded-full -mr-32 -mt-32 blur-3xl" />

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-12 border border-white/10 shadow-inner">
                                <FaShieldAlt className="text-[#57c2ce]" size={24} />
                            </div>
                            <h2 className="text-5xl font-black text-white italic tracking-tighter leading-[0.9] mb-8">
                                NUEVA<br />
                                <span className="text-[#57c2ce]">ENTIDAD</span>
                            </h2>
                            {/* LOGO AREA (En lugar del texto descriptivo) */}
                            <div className="flex flex-col items-start gap-3 border-l border-slate-100 pl-6 mb-10 max-w-[200px]">
                                {/* Contenedor del Logo con efecto de brillo técnico */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#60e2ff] to-[#051d26] rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                                    <img
                                        src="/denarTexto.png" // <--- Asegúrate de que esta ruta sea correcta
                                        alt="Denar Logo"
                                        className="relative h-50 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                <FaFingerprint className="text-[#57c2ce]/50" size={16} />
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.6em]">Secure_Onboarding_v2</span>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Formulario Quirúrgico */}
                    <div className="flex-1 p-16 md:p-24 bg-white relative">
                        <button
                            onClick={onClose}
                            className="absolute top-12 right-12 w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all group"
                        >
                            <FaTimes size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center">
                            {/* Selector de Tipo (Moral/Física) con más aire */}
                            <div className="flex gap-8 mb-16">
                                {[
                                    { id: 'moral', label: 'Persona Moral', icon: <FaBuilding /> },
                                    { id: 'fisica', label: 'Persona Física', icon: <FaUserTie /> }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, person_type: t.id })}
                                        className={`flex-1 py-6 rounded-3xl border-2 font-normal text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${formData.person_type === t.id
                                            ? 'border-[#051d26] bg-[#124153] text-white shadow-2xl scale-[1.02]'
                                            : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'
                                            }`}
                                    >
                                        <span className={formData.person_type === t.id ? 'text-[#57c2ce]' : ''}>{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* Grid de Inputs de Alta Densidad */}
                            <div className="grid grid-cols-12 gap-x-10 gap-y-10">
                                <div className="col-span-12">
                                    <ModalField label="Razón Social / Nombre Comercial" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="EJ: SERVICIOS FINANCIEROS DENAR S.A." />
                                </div>

                                <div className="col-span-12 md:col-span-5">
                                    <ModalField label="RFC" value={formData.rfc} isMono onChange={v => setFormData({ ...formData, rfc: v.toUpperCase() })} placeholder="XXXX000000XXX" maxLength={13} />
                                </div>

                                <div className="col-span-12 md:col-span-7">
                                    <ModalField label="Email de Contacto" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="ADMIN@NODO.COM" />
                                </div>

                                <AnimatePresence>
                                    {formData.person_type === 'fisica' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                            className="col-span-12 grid grid-cols-2 gap-10"
                                        >
                                            <ModalField label="Apellido Paterno" value={formData.first_last} onChange={v => setFormData({ ...formData, first_last: v })} />
                                            <ModalField label="Apellido Materno" value={formData.second_last} onChange={v => setFormData({ ...formData, second_last: v })} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Acción Final */}
                            <div className="mt-16">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#82c9c4] text-[#051d26] py-7 rounded-3xl font-normal text-[10px] uppercase tracking-[0.5em] shadow-[0_20px_40px_-10px_rgba(5,29,38,0.3)] hover:bg-[#d3e0e5] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-5 disabled:opacity-50"
                                >
                                    {loading ? (
                                        "SINCRONIZANDO CON NODO..."
                                    ) : (
                                        <>
                                            <FaCheckCircle className="text-[#051d26] text-lg" />
                                            Finalizar Registro de Socio
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// Componente de Input optimizado para el Modal
const ModalField = ({ label, value, onChange, type = "text", placeholder, isMono, maxLength }) => (
    <div className="space-y-3 group">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.4em] ml-2 group-focus-within:text-[#57c2ce] transition-colors">
            {label}
        </label>
        <input
            required
            type={type}
            value={value}
            maxLength={maxLength}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-slate-100 border-b-2 border-slate-200 p-5 text-[13px] font-normal text-[#051d26] outline-none focus:border-[#57c2ce] focus:bg-white transition-all placeholder:text-slate-400 ${isMono ? 'font-mono tracking-[0.2em]' : ''}`}
        />
    </div>
);

export default FormClienteModal;