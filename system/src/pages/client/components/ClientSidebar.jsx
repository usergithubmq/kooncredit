import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUsers, FaFileInvoiceDollar, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';

const ClientSidebar = ({ vistaActual, setVistaActual, clienteInfo, handleLogout, getLogoUrl }) => {

    const brandColor = clienteInfo?.primary_color || '#60e2ff';

    // 1. LÓGICA DE LOGO CORREGIDA (Evita placeholders externos que fallan)
    const logoSrc = useMemo(() => {
        if (!clienteInfo?.logo_url) return null;
        const base = getLogoUrl(clienteInfo.logo_url);
        // El timestamp previene que el navegador use una versión vieja del logo
        return `${base}?update=${new Date().getTime()}`;
    }, [clienteInfo?.logo_url, getLogoUrl]);

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    const NavButton = ({ id, icon: Icon, label }) => {
        const isActive = vistaActual === id;
        return (
            <motion.button
                variants={itemVariants}
                whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVistaActual(id)}
                className={`relative w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-white/10 shadow-lg' : 'text-slate-300 hover:text-white'
                    }`}
                style={isActive ? { borderLeft: `3px solid ${brandColor}` } : {}}
            >
                <Icon
                    className="text-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ color: isActive ? brandColor : '#60e2ff' }}
                />
                <span className={`text-xs tracking-widest uppercase ${isActive ? 'font-extralight text-white' : 'font-extralight'}`}>
                    {label}
                </span>

                <AnimatePresence>
                    {isActive && (
                        <motion.div
                            layoutId="activeGlow"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-4 w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: brandColor,
                                boxShadow: `0 0 15px ${brandColor}`
                            }}
                        />
                    )}
                </AnimatePresence>
            </motion.button>
        );
    };

    return (
        <aside className="w-64 bg-[#051d26] hidden md:flex flex-col text-white shadow-[10px_0_50px_rgba(0,0,0,0.4)] fixed h-full z-50 border-r border-white/5 overflow-hidden font-sans">

            {/* --- ÁREA DE LOGO: LIMPIA Y FUNCIONAL --- */}
            <div className="p-10 relative flex flex-col items-center">
                <div className="relative z-10 w-full min-h-[80px] flex flex-col items-center justify-center">
                    {logoSrc ? (
                        <motion.img
                            key={logoSrc}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={logoSrc}
                            alt="Logo"
                            className="max-h-30 w-auto object-contain filter drop-shadow-2xl"
                            // Si la imagen falla, mostramos el texto de Denar por seguridad
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none" style={{ color: brandColor }}>
                            DENAR
                        </h1>
                    )}
                </div>

                {/* Glow ambiental dinámico */}
                <div
                    className="absolute -top-20 -left-20 w-48 h-48 blur-[80px] rounded-full opacity-10 pointer-events-none"
                    style={{ backgroundColor: brandColor }}
                />
            </div>

            {/* --- NAVEGACIÓN --- */}
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="flex-1 px-4 space-y-2"
            >
                <div className="px-4 mb-4 mt-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    Navegación Principal
                </div>

                <NavButton id="profile" icon={FaUser} label="Mi Perfil" />
                <NavButton id="pagadores" icon={FaUsers} label="Mis Clientes" />
                <NavButton id="reporte" icon={FaFileInvoiceDollar} label="Reporte de Pagos" />

                {/* Sección Extra: Seguridad */}
                <div className="pt-10 px-4 mb-2 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    Soporte & Estado
                </div>
                <div className="px-5 py-4 bg-white/[0.02] rounded-[1.5rem] border border-white/5 mx-2">
                    <div className="flex items-center gap-2 mb-2" style={{ color: brandColor }}>
                        <FaShieldAlt size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Seguridad Activa</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            className="h-full"
                            style={{ backgroundColor: brandColor, boxShadow: `0 0 10px ${brandColor}` }}
                        />
                    </div>
                </div>
            </motion.nav>

            {/* --- FOOTER / SALIR --- */}
            <div className="p-6 bg-black/20 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                >
                    <div className="flex items-center gap-3">
                        <FaSignOutAlt className="text-base group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cerrar Sesión</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
                </button>

                <div className="mt-4 text-center">
                    <p className="text-[7px] font-black text-slate-800 uppercase tracking-[0.5em]">
                        Denar © 2026
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default ClientSidebar;