import React from "react";
import { FaUsers, FaSync, FaBell, FaPlus, FaTimes } from "react-icons/fa";

export default function DashboardHeader({
    scrolled,
    clienteInfo,
    estadisticas,
    refreshData,
    refreshing,
    setShowNotifications,
    showNotifications,
    notifications,
    showForm,
    setShowForm
}) {
    // 1. Color de la marca
    const brandColor = clienteInfo?.primary_color || "#051d26";

    // 2. Función Maestra de Contraste (Luminancia)
    // Determina si necesitamos elementos claros o oscuros sobre el fondo del cliente
    const getThemeMode = (hex) => {
        if (!hex) return { text: "#ffffff", muted: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)", btn: "#ffffff", btnText: "#051d26" };
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Si el fondo es claro
        if (brightness > 150) {
            return {
                text: "#051d26",
                muted: "#051d26",
                border: "rgba(5, 29, 38, 0.15)",
                btn: "#051d26",
                btnText: "#ffffff",
                grid: "rgba(5, 29, 38, 0.05)"
            };
        }
        // Si el fondo es oscuro
        return {
            text: "#ffffff",
            muted: "#fff",
            border: "rgba(255,255,255,0.1)",
            btn: "#ffffff",
            btnText: "#051d26",
            grid: "rgba(255,255,255,0.05)"
        };
    };

    const theme = getThemeMode(brandColor);

    return (
        <div className="sticky top-0 z-[50] w-full flex justify-center transition-all duration-500 ease-in-out py-4">
            <nav
                className={`relative flex items-center justify-between w-[95%] px-10 rounded-[26px] overflow-hidden border shadow-2xl transition-all duration-700
                ${scrolled ? 'h-[80px] w-[90%]' : 'h-[100px] w-[95%]'}`}
                style={{
                    // EL FONDO CAMBIA SEGÚN EL CLIENTE
                    background: scrolled
                        ? `${brandColor}ff` // Más sólido al hacer scroll
                        : `${brandColor}f2`, // Más transparente al estar arriba
                    backdropFilter: "blur(8px)",
                    borderColor: theme.border,
                    boxShadow: scrolled ? `0 20px 40px -15px ${brandColor}66` : 'none'
                }}
            >
                {/* TEXTURA: Rejilla Nanotech adaptable */}
                <div
                    className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, ${theme.text}11 1px, transparent 1px),
                            linear-gradient(to bottom, ${theme.text}11 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                        opacity: 0.8
                    }}
                />

                <div className="relative z-10 flex flex-col">
                    {clienteInfo?.nombre_comercial && (
                        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.25em] mt-1" style={{ color: theme.muted }}>
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute h-full w-full rounded-full opacity-100" style={{ backgroundColor: theme.text }}></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: theme.text }}></span>
                            </span>
                            {clienteInfo.nombre_comercial}
                        </div>
                    )}
                </div>

                {/* ACCIONES */}
                <div className="relative z-10 flex items-center gap-4">
                    <button
                        onClick={refreshData}
                        className="p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{ backgroundColor: `${theme.text}11`, color: theme.text }}
                    >
                        <FaSync className={refreshing ? "animate-spin" : ""} />
                    </button>

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-xl transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: `${theme.text}11`, color: theme.text }}
                    >
                        <FaBell />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2" style={{ borderColor: brandColor }} />
                        )}
                    </button>

                    <div className="h-10 w-[1px] mx-2" style={{ backgroundColor: theme.border }} />

                    {/* BOTÓN DINÁMICO SATINADO */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden text-[10px] font-normal uppercase tracking-[2px] rounded-[14px] transition-all duration-500 group active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: showForm ? "#ef4444" : theme.btn,
                            color: showForm ? "#ffffff" : theme.btnText,
                        }}
                    >
                        {/* Brillo Satinado */}
                        <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 group-hover:left-full" />

                        <span className="relative z-10 flex items-center gap-2">
                            {showForm ? <FaTimes size={14} /> : <FaPlus size={14} />}
                            {showForm ? 'Cancelar' : 'Nuevo Registro'}
                        </span>
                    </button>
                </div>
            </nav>
        </div>
    );
}