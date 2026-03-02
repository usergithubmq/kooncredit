import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUsers, FaFileInvoiceDollar, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import EndUserForm from "./components/EndUserForm";
import StpAccountsTable from "./components/StpAccountsTable";

export default function Dashboard() {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [endUsers, setEndUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchMyEndUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/client/end-users");
            let rawResponse = res.data;

            // --- LIMPIADOR DE "RUIDO" PHP ---
            // Si la respuesta es un string (porque trae errores de PHP arriba), 
            // buscamos el inicio real del JSON '{'
            if (typeof rawResponse === 'string' && rawResponse.includes('{"empresa"')) {
                try {
                    const jsonStart = rawResponse.indexOf('{');
                    rawResponse = JSON.parse(rawResponse.substring(jsonStart));
                } catch (e) {
                    console.error("Error parseando JSON sucio", e);
                }
            }

            console.log("Datos para la tabla:", rawResponse);

            // Tu controlador devuelve { data: [...] }
            // Validamos que exista rawResponse y su propiedad data
            const finalArray = (rawResponse && Array.isArray(rawResponse.data))
                ? rawResponse.data
                : [];

            setEndUsers(finalArray);
        } catch (err) {
            console.error("Error al cargar pagadores", err);
            setEndUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEndUsers();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("¡Copiado al portapapeles!");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* SIDEBAR CLIENTE */}
            <aside className="w-72 bg-[#0c516e] p-6 hidden md:flex flex-col text-white shadow-2xl fixed h-full">
                <h1 className="text-3xl font-black mb-10 tracking-tight text-teal-400 uppercase">KOON<span className="text-white"> SYSTEM</span></h1>
                <nav className="space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 border-l-4 border-teal-400 text-sm font-bold shadow-lg">
                        <FaUsers /> Mis Pagadores
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-sm font-medium text-slate-300">
                        <FaFileInvoiceDollar /> Reporte de Pagos
                    </button>
                </nav>
                <button onClick={() => { localStorage.clear(); navigate("/login"); }}
                    className="flex items-center gap-3 p-3 text-red-300 hover:text-white transition-colors text-xs font-bold border-t border-white/10 pt-6 uppercase tracking-widest">
                    <FaSignOutAlt /> SALIR
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-72 p-10">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Panel de Cobranza</h2>
                        <p className="text-slate-500 font-medium">Gestiona tus cuentas referenciadas de cobranza.</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)}
                        className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all shadow-xl active:scale-95 ${showForm ? 'bg-red-500 text-white' : 'bg-[#0c516e] text-white'}`}>
                        {showForm ? <><FaSignOutAlt className="rotate-90" /> CANCELAR</> : <><FaUserPlus /> NUEVO PAGADOR</>}
                    </button>
                </header>

                {showForm && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <EndUserForm onUserCreated={() => {
                            setShowForm(false);
                            fetchMyEndUsers(); // Recargar la lista automáticamente
                        }} />
                    </div>
                )}

                <div className="mt-8">
                    <StpAccountsTable
                        endUsers={endUsers}
                        onCopy={copyToClipboard}
                        loading={loading}
                        onRefresh={fetchMyEndUsers}
                    />
                </div>
            </main>
        </div>
    );
}