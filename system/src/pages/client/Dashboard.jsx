import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUsers, FaFileInvoiceDollar, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import EndUserForm from "./components/EndUserForm";
import Conciliacion from "./Conciliacion";
import ProfileView from "./ProfileView";
import StpAccountsTable from "./components/StpAccountsTable";
import BalanceModal from "./components/BalanceModal";
import KoonSidebar from "./components/KoonSidebar";

export default function Dashboard() {
    const navigate = useNavigate();

    // ESTADOS
    const [vistaActual, setVistaActual] = useState('pagadores'); // <--- Esto faltaba
    const [showForm, setShowForm] = useState(false);
    const [endUsers, setEndUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [clienteInfo, setClienteInfo] = useState(null);

    const fetchMyEndUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/client/end-users");
            let rawResponse = res.data;

            if (typeof rawResponse === 'string' && rawResponse.includes('{"empresa"')) {
                try {
                    const jsonStart = rawResponse.indexOf('{');
                    rawResponse = JSON.parse(rawResponse.substring(jsonStart));
                } catch (e) {
                    console.error("Error parseando JSON sucio", e);
                }
            }

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
        api.get("/client/profile").then(res => setClienteInfo(res.data));
        fetchMyEndUsers();
    }, []);

    useEffect(() => {
        fetchMyEndUsers();
    }, []);

    const handleViewBalance = (user) => {
        setSelectedUser(user);
        setShowBalanceModal(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("¡Copiado al portapapeles!");
    };

    const handleLogout = async () => {
        try {
            // 1. Avisamos al servidor que cerramos sesión (esto invalida el token en Laravel)
            await api.post("/logout");
        } catch (err) {
            console.error("Error al avisar al servidor del logout", err);
        } finally {
            // 2. Limpiamos TODO el rastro local
            localStorage.clear();
            sessionStorage.clear();

            // 3. ¡IMPORTANTE! Redireccionamos usando window.location para forzar 
            // al navegador a pedir un token CSRF nuevo y limpio al recargar
            window.location.href = "/login";
        }
    };

    // Agrega esto antes del return en tu componente Dashboard
    const getLogoUrl = (path) => {
        if (!path) return null;
        if (window.location.hostname === 'localhost') {
            return `http://localhost:8000/storage/${path}`;
        }
        return `/storage/${path}`;
    };


    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* 1. EL SIDEBAR COMPONENTE */}
            <KoonSidebar
                vistaActual={vistaActual}
                setVistaActual={setVistaActual}
                clienteInfo={clienteInfo}
                handleLogout={handleLogout}
                getLogoUrl={getLogoUrl}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 transition-all duration-300">
                {vistaActual === 'pagadores' ? (
                    <>
                        <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-4 bg-[#064760] backdrop-blur-md border-[#a8c6d4] shadow-sm mb-6">
                            <div className="flex flex-col gap-0.5">
                                {/* Título y descripción unidos */}
                                <div className="flex items-baseline">
                                    <span className="text-[24px] text-[#fff] font-light hidden md:block">Gestión de cuentas referenciadas</span>
                                </div>

                                {/* Etiqueta compacta */}
                                {clienteInfo?.nombre_comercial && (
                                    <div className="flex items-center gap-1.5 text-[12px] font-normal text-teal-100 uppercase tracking-[0.1em]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                                        {clienteInfo.nombre_comercial}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowForm(!showForm)}
                                className={`group px-6 py-2.5 rounded-xl font-black text-[11px] flex items-center gap-2 transition-all shadow-md active:scale-95 ${showForm
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-[#126588] text-white hover:bg-[#0a435c]'
                                    }`}
                            >
                                {showForm ? (
                                    <>CANCELAR</>
                                ) : (
                                    <>
                                        <FaUserPlus className="group-hover:scale-110 transition-transform" />
                                        NUEVO REGISTRO
                                    </>
                                )}
                            </button>
                        </header>
                        {showForm && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300 px-10">
                                <EndUserForm onUserCreated={() => {
                                    setShowForm(false);
                                    fetchMyEndUsers();
                                }} />
                            </div>
                        )}

                        <div className="px-10">
                            <StpAccountsTable
                                endUsers={endUsers}
                                onCopy={copyToClipboard}
                                loading={loading}
                                onRefresh={fetchMyEndUsers}
                                onViewBalance={handleViewBalance}
                            />
                        </div>
                    </>
                ) : vistaActual === 'profile' ? (
                    <ProfileView clienteInfo={clienteInfo} onUpdate={() => {/* recarga tus datos */ }} />
                ) : (
                    <Conciliacion />
                )}
            </main>

            <BalanceModal
                isOpen={showBalanceModal}
                onClose={() => setShowBalanceModal(false)}
                user={selectedUser}
            />
        </div>
    );
}