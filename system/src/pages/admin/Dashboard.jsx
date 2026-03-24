import React, { useState } from "react";
import { FaUserPlus, FaUsers, FaSignOutAlt, FaBuilding, FaUserTie, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api, { authApi } from "../../api/axios";
import ClientList from "./components/ClientList";
import logoKoon from "../../assets/kf3d.png";

export default function Dashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState("create"); // "create" o "list"
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        person_type: "moral",
        name: "",
        first_last: "",
        second_last: "",
        email: "",
        rfc: "",
        password: "password123"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // --- PASO CLAVE PARA EVITAR EL ERROR 419 ---
            // Esto le pide a Laravel la "ficha de seguridad" (cookie)
            await authApi.get("/sanctum/csrf-cookie");

            // Ahora sí, enviamos el formulario con la ficha ya cargada en el navegador
            await api.post("/admin/clients", formData);

            alert("¡Éxito! Cliente registrado con sus cuentas STP.");
            setFormData({ person_type: "moral", name: "", first_last: "", second_last: "", email: "", rfc: "", password: "password123" });
            setView("list");
        } catch (err) {
            // Esto te dirá si el servidor respondió o si la petición ni siquiera salió
            console.error("Error Detallado:", {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            alert("Error: " + (err.response?.data?.message || "Error de conexión con el servidor"));
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0c516e] shadow-xl p-6 hidden md:flex flex-col text-white fixed h-full">
                {/* CONTENEDOR DEL LOGO */}
                <div className="flex flex-col items-center justify-center mb-12 group cursor-pointer relative">
                    {/* Aura de luz detrás del logo (Solo visible al hacer hover) */}
                    <div className="absolute w-32 h-32 bg-teal-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative">
                        {/* Imagen del Logo con Reflejo Dinámico */}
                        <div className="relative overflow-hidden">
                            <img
                                src={logoKoon}
                                alt="KoonSystem Logo"
                                className="w-150 h-150 object-contain transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
                            />

                            {/* Destello de luz que cruza el logo al pasar el mouse */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        </div>
                    </div>

                    {/* Etiqueta Minimalista */}
                    <div className="mt-4 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-teal-400 transition-colors duration-500">
                            Koon Finansen
                        </span>
                        {/* Línea decorativa que crece */}
                        <div className="h-[2px] w-0 bg-teal-400 group-hover:w-8 transition-all duration-500 rounded-full" />
                    </div>
                </div>
                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setView("create")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${view === 'create' ? 'bg-white/10 border-l-4 border-teal-400 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                        <FaUserPlus /> Alta de Clientes
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${view === 'list' ? 'bg-white/10 border-l-4 border-teal-400 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                        <FaUsers /> Ver Clientes
                    </button>
                </nav>

                <button onClick={() => { localStorage.clear(); navigate("/login"); }}
                    className="flex items-center gap-3 p-3 text-red-300 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border-t border-white/10 pt-6">
                    <FaSignOutAlt /> Salir del Sistema
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-72 p-10">
                {/* HEADER */}
                <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Módulo Administrativo</h2>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs font-bold border border-teal-100 uppercase tracking-widest">
                        Sesión Activa
                    </div>
                </header>

                <div className={`${view === 'create' ? 'max-w-4xl' : 'max-w-6xl'} mx-auto transition-all duration-500`}>

                    {view === "create" ? (
                        /* VISTA: REGISTRO */
                        <section className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                            <div className="bg-slate-50 border-b border-slate-100 p-8">
                                <h3 className="text-xl font-bold text-[#0c516e] flex items-center gap-3">
                                    <FaUserPlus className="text-teal-500" /> Registro de Cliente B2B
                                </h3>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Identidad del Cliente</label>
                                    <div className="flex gap-4">
                                        {[
                                            { id: 'moral', label: 'Empresa (Moral)', icon: <FaBuilding /> },
                                            { id: 'fisica', label: 'Individual (Física)', icon: <FaUserTie /> }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, person_type: t.id })}
                                                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${formData.person_type === t.id
                                                    ? 'border-[#0c516e] bg-[#0c516e] text-white shadow-lg'
                                                    : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {t.icon} {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={formData.person_type === 'moral' ? 'md:col-span-2' : ''}>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                                            {formData.person_type === 'moral' ? 'Razón Social' : 'Nombre(s)'}
                                        </label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                            placeholder={formData.person_type === 'moral' ? "Ej. Bluelife Network S.A. de C.V." : "Ej. Juan"} />
                                    </div>

                                    {formData.person_type === 'fisica' && (
                                        <>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Apellido Paterno</label>
                                                <input required type="text" value={formData.first_last} onChange={e => setFormData({ ...formData, first_last: e.target.value })}
                                                    className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Apellido Materno</label>
                                                <input type="text" value={formData.second_last} onChange={e => setFormData({ ...formData, second_last: e.target.value })}
                                                    className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500 transition-all" />
                                            </div>
                                        </>
                                    )}

                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">RFC</label>
                                            <input required type="text" maxLength={13} value={formData.rfc}
                                                onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                                                className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:ring-2 focus:ring-teal-500 outline-none" placeholder="ABC123456XYZ" />
                                            <span className="absolute right-4 bottom-4 text-[10px] font-bold text-slate-300">{formData.rfc.length}/13</span>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Corporativo</label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500" placeholder="contacto@empresa.com" />
                                        </div>
                                    </div>
                                </div>

                                <button disabled={loading} className="w-full bg-[#0c516e] text-white font-black py-5 rounded-2xl hover:bg-[#084158] transition-all shadow-xl flex items-center justify-center gap-3 tracking-widest uppercase disabled:opacity-50">
                                    {loading ? "Generando cuentas STP..." : <><FaCheckCircle /> Finalizar Registro de Cliente</>}
                                </button>
                            </form>
                        </section>
                    ) : (
                        /* VISTA: LISTADO */
                        <div className="animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-[#0c516e] mb-6 flex items-center gap-3">
                                <FaUsers className="text-teal-500" /> Directorio de Clientes Activos
                            </h3>
                            <ClientList />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}