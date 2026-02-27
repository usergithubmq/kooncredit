import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserPortal = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login-pagador'); // Redirigir si no hay sesión
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-teal-100">
            <main className="max-w-7xl mx-auto px-8 py-12 md:py-20">

                {/* Header del Portal */}
                <header className="flex justify-between items-end mb-20 border-b border-slate-100 pb-10">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-4 block">Portal Oficial de Pagos</span>
                        <h1 className="text-[#0c516e] text-5xl font-extralight tracking-tighter">
                            Bienvenido, <span className="font-normal">{user.name.split(' ')[0]}</span>
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors pb-2"
                    >
                        Finalizar Sesión
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Tarjeta de CLABE STP */}
                    <div className="lg:col-span-1 bg-white p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-100 transition-colors duration-700"></div>

                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0c516e]/40 mb-10">Identificador SPEI</h3>

                        <p className="text-slate-400 text-xs font-light mb-4">Tu CLABE Interbancaria única:</p>
                        <div className="bg-slate-50/80 backdrop-blur-sm py-8 rounded-3xl border border-slate-100 mb-8 flex items-center justify-center">
                            <code className="text-2xl text-[#0c516e] font-mono font-bold tracking-tight">
                                {user.clabe_stp || 'PENDIENTE'}
                            </code>
                        </div>

                        <div className="space-y-4 text-[11px] text-slate-400 font-light leading-relaxed">
                            <p>• Abonos automáticos 24/7 vía SPEI.</p>
                            <p>• Destino: <span className="font-bold text-[#0c516e]">STP (Sistema de Transferencias y Pagos)</span>.</p>
                            <p>• Beneficiario: <span className="font-bold text-[#0c516e]">{user.name}</span>.</p>
                        </div>
                    </div>

                    {/* Historial de Movimientos */}
                    <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-slate-100">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0c516e]/40">Actividad Financiera</h3>
                            <div className="px-4 py-1 bg-teal-50 text-teal-600 rounded-full text-[9px] font-black uppercase tracking-widest">En Tiempo Real</div>
                        </div>

                        {/* Estado vacío elegante */}
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-50 rounded-[2rem]">
                            <div className="w-12 h-[1px] bg-slate-200 mb-6"></div>
                            <p className="text-slate-300 font-light italic text-sm">Sin transacciones registradas este mes.</p>
                        </div>
                    </div>

                </div>

                <footer className="mt-20 flex justify-center opacity-30">
                    <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400">CDMX • KOONFINANCE © 2026</p>
                </footer>
            </main>
        </div>
    );
};

export default UserPortal;