import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import BalanceCard from './components/BalanceCard';
import PaymentStatus from './components/PaymentStatus';
import KoonSidebar from "./components/KoonSidebar";
import BrandCarousel from './components/BrandCarousel';
import CheckoutButton from './components/CheckoutButton';

import PaymentModal from './components/modal/PaymentModal';

const Dashboard = () => {
    const navigate = useNavigate();

    const [vistaActual, setVistaActual] = useState('dashboard');
    const [userName, setUserName] = useState("Usuario");
    const [loading, setLoading] = useState(true);
    const [clienteInfo, setClienteInfo] = useState(null);

    const [wallet, setWallet] = useState({
        saldo: 0,
        clabe: 'Cargando...',
        pago_pendiente: 0,
        proximo_vencimiento: 'N/A'
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) {
            const full = `${savedUser.name || ''} ${savedUser.first_last || ''}`.trim();
            const formatted = full.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            setUserName(formatted || "Usuario");
        }

        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('/api/my/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    setWallet(response.data.data);
                    if (response.data.data.empresa) {
                        setClienteInfo(response.data.data.empresa);
                    }
                }
            } catch (error) {
                console.error("Error en Dashboard:", error);
                if (error.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
            <KoonSidebar
                vistaActual={vistaActual}
                setVistaActual={setVistaActual}
                handleLogout={handleLogout}
                clienteInfo={clienteInfo}
            />

            <main className="flex-1 ml-64 transition-all duration-300">
                <div className="mx-auto max-w-5xl px-8 pb-12">
                    {/* Header de bienvenida */}
                    <header className="my-12 flex items-center justify-between">
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h1 className="text-4xl font-light tracking-tighter text-slate-900 leading-tight">
                                Hola, <span className="font-bold text-[#0c516e]">{userName}</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {clienteInfo?.nombre ? ` ${clienteInfo.nombre}` : 'B2C Node'}
                                </p>
                            </div>
                        </motion.div>

                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-800 to-black shadow-xl flex items-center justify-center border border-white/10 text-white font-bold text-xl">
                            {userName.charAt(0)}
                        </div>
                    </header>

                    {/* Grid Principal */}
                    <div className="grid gap-10 lg:grid-cols-12 items-start">

                        {/* Columna Izquierda (7/12) */}
                        <div className="lg:col-span-7 space-y-8">
                            <BalanceCard saldo={wallet.saldo} clabe={wallet.clabe} />

                            {/* Carrusel dentro de la columna para no romper el grid */}
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
                                    Paga en efectivo en:
                                </p>
                                <BrandCarousel />
                            </div>
                        </div>

                        {/* Columna Derecha (5/12) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            {/* <PaymentStatus
                                monto={wallet.pago_pendiente}
                                fecha={wallet.proximo_vencimiento}
                            /> */}

                            <CheckoutButton
                                monto={wallet.pago_pendiente}
                                clienteNombre={clienteInfo?.nombre}
                                onOpenModal={() => setIsModalOpen(true)} // <-- Nueva prop
                            />

                            <PaymentModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                monto={wallet.pago_pendiente}
                                clienteNombre={clienteInfo?.nombre}
                            />

                            {/* Banner de soporte */}
                            <div className="rounded-[2rem] bg-gradient-to-br from-[#0c516e] to-[#164e63] p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2 tracking-tight">¿Necesitas ayuda?</h3>
                                    <p className="text-sm opacity-80 leading-relaxed mb-6">
                                        El equipo de {clienteInfo?.nombre || 'KoonPay'} está disponible para asistirte.
                                    </p>
                                    <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/10">
                                        Contactar Soporte
                                    </button>
                                </div>
                                <div className="absolute bottom-[-20%] right-[-10%] opacity-10 text-[10rem] font-black italic select-none uppercase pointer-events-none">
                                    {clienteInfo?.nombre?.split(' ')[0] || 'KOON'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Ver Historial */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 flex justify-center"
                    >
                        <button
                            onClick={() => setVistaActual('history')}
                            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#0c516e] transition-all"
                        >
                            <span>Ver Historial de Movimientos</span>
                            <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;