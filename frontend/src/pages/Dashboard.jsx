import React from "react";
import { FaChartLine, FaUser, FaCog, FaDollarSign, FaBell } from "react-icons/fa";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 flex">

            {/* SIDEBAR */}
            <aside className="w-72 bg-[#0c516e] backdrop-blur-xl shadow-xl border-r border-white/30 p-6 hidden md:flex flex-col">
                <h1 className="text-2xl font-bold mb-10 tracking-tight">
                    <span className="text-teal-500">Koon</span>Credit
                </h1>

                <nav className="space-y-4 text-sm font-medium">
                    <a className="flex items-center gap-3 p-3 rounded-xl bg-teal-600 text-white shadow-md">
                        <FaChartLine /> Dashboard
                    </a>
                    <a className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-slate-100 transition">
                        <FaUser /> Mi Perfil
                    </a>
                    <a className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-slate-100 transition">
                        <FaDollarSign /> Mis Créditos
                    </a>
                    <a className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-slate-100 transition">
                        <FaCog /> Configuración
                    </a>
                </nav>

                <div className="mt-auto pt-10 border-t border-slate-200">
                    <p className="text-xs text-white text-center">
                        © {new Date().getFullYear()} KoonCredit
                        <br />Todos los derechos reservados.
                    </p>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-10">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Bienvenido 👋</h2>

                    <div className="flex items-center gap-4">
                        <button className="relative">
                            <FaBell className="text-slate-500 hover:text-slate-700 text-xl transition" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="avatar"
                            className="w-10 h-10 rounded-full border border-white shadow"
                        />
                    </div>
                </header>

                {/* CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Línea de crédito</h3>
                        <p className="text-3xl font-bold text-teal-600">$30,000 MXN</p>
                        <p className="text-xs text-slate-500 mt-1">Aprobado</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Crédito utilizado</h3>
                        <p className="text-3xl font-bold text-slate-800">$12,700 MXN</p>
                        <p className="text-xs text-slate-500 mt-1">Al día de hoy</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                        <h3 className="text-sm font-medium text-slate-500 mb-2">Próximo pago</h3>
                        <p className="text-3xl font-bold text-rose-600">$1,860 MXN</p>
                        <p className="text-xs text-slate-500 mt-1">15 de diciembre</p>
                    </div>

                </div>

                {/* BIG WIDGET */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
                    <h3 className="text-xl font-bold mb-6">Actividad reciente</h3>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="font-medium">Pago recibido</span>
                            <span className="text-teal-600 font-bold">+$1,860</span>
                        </div>

                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="font-medium">Compra financiada</span>
                            <span className="text-rose-600 font-bold">-$6,200</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">Ajuste de crédito</span>
                            <span className="text-slate-700 font-bold">$0.00</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
