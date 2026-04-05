import React from 'react';
import { FaChartBar, FaUsers, FaTerminal, FaSignOutAlt } from "react-icons/fa";

const AdminSidebar = ({ view, setView, handleLogout }) => {
    // Menú estructural: Dashboard, Directorio y ahora Logs Full View
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar size={14} /> },
        { id: 'list', label: 'Directorio', icon: <FaUsers size={14} /> },
    ];

    return (
        <aside className="w-64 bg-[#051d26] border-r border-white/5 flex flex-col fixed h-full z-50 shadow-[20px_0_50px_rgba(0,0,0,0.3)]">

            {/* BRANDING AREA */}
            <div className="p-10 flex flex-col items-center">
                <img src="/denarTexto.png" alt="Denar Logo" className="w-28 h-auto mb-2" />
                <div className="h-[1px] w-12 bg-[#57c2ce]/30 mb-2" />
                <span className="text-[10px] font-black tracking-[0.6em] text-[#57c2ce] uppercase opacity-80">Core Engine</span>
            </div>

            {/* NAV LINKS */}
            <nav className="flex-1 px-6 mt-6 space-y-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-500 group ${view === item.id
                            ? 'bg-[#57c2ce] text-[#051d26] shadow-[0_15px_30px_rgba(87,194,206,0.2)] scale-[1.02]'
                            : 'text-[#d3e0e5] hover:bg-white/[0.02] hover:text-slate-200'
                            }`}
                    >
                        <span className={`transition-transform duration-500 ${view === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* LOGOUT BOTÓN */}
            <div className="px-6 mb-10 mt-auto"> {/* mt-auto para asegurar que siempre esté al fondo */}
                <button
                    onClick={handleLogout}
                    className="group w-full py-4 px-6 flex items-center justify-between bg-white/[0.03] hover:bg-rose-500/[0.08] border border-white/5 hover:border-rose-500/20 rounded-2xl transition-all duration-500 backdrop-blur-sm shadow-sm"
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] group-hover:text-white transition-colors">
                            Cerrar Sesión
                        </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all duration-500">
                        <FaSignOutAlt className="text-slate-500 text-[10px] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;