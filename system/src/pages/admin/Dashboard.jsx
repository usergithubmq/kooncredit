import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import api, { authApi } from "../../api/axios";

// Componentes Core Fraccionados
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import ClientList from "./components/ClientList";
import Estadisticas from "./components/Estadisticas";
import LogsSistema from "./components/LogsSistema";
import FormClienteModal from "./components/modal/FormClienteModal";

export default function Dashboard() {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard"); // dashboard | list | logs
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado inicial del formulario
    const initialFormState = {
        person_type: "moral",
        name: "",
        first_last: "",
        second_last: "",
        email: "",
        rfc: "",
        password: "password123"
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleLogout = () => { navigate("/login"); };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // 1. Obtener la ficha de seguridad (CSRF)
            await authApi.get("/sanctum/csrf-cookie");

            // 2. Generar el Slug para evitar el error 1364 de SQL
            const generatedSlug = formData.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

            // 3. Unir el slug a los datos
            const dataToSync = { ...formData, slug: generatedSlug };

            // 4. Enviar a Laravel usando la instancia 'api'
            await api.post("/admin/clients", dataToSync);

            alert("¡Éxito! Cliente registrado con sus cuentas STP.");
            setIsModalOpen(false); // Si usas el modal
            setFormData(initialFormState);
            setView("list");
        } catch (err) {
            console.error("Error Detallado:", err.response?.data);
            alert("Error: " + (err.response?.data?.message || "Error de conexión"));
        } finally {
            setLoading(false);
        }
    };

    // Configuración de animación para cambios de vista
    const pageTransition = {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 1.01 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div className="h-screen w-screen bg-[#051d26] flex font-sans overflow-hidden text-[#051d26]">

            <AdminSidebar view={view} setView={setView} handleLogout={handleLogout} />

            <main className="flex-1 ml-64 flex flex-col h-screen bg-[#f8fafc] relative overflow-hidden">
                <AdminHeader view={view} openModal={() => setIsModalOpen(true)} />

                <div className="flex-1 overflow-y-auto p-5 relative custom-scrollbar">
                    {/* Grid tecnológico de fondo sutil */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#051d26 1.5px, transparent 0)', backgroundSize: '40px 40px' }} />

                    <AnimatePresence mode="wait">
                        {/* VISTA 1: DASHBOARD UNIFICADO (Stats + Logs debajo) */}
                        {view === "dashboard" && (
                            <motion.div
                                key="dash"
                                {...pageTransition}
                                className="flex flex-col gap-10 pb-20" // Flex col para apilar verticalmente
                            >
                                {/* PARTE SUPERIOR: Telemetría comprimida */}
                                <Estadisticas />
                                <LogsSistema />

                            </motion.div>
                        )}

                        {/* VISTA 2: DIRECTORIO DE CLIENTES (Sigue siendo independiente si quieres) */}
                        {view === "list" && (
                            <motion.div key="list" {...pageTransition} className="w-full pb-20">
                                <ClientList />
                            </motion.div>
                        )}

                        {/* VISTA 3: Si quisieras ver los Logs solos en pantalla completa */}
                        {view === "logs" && (
                            <motion.div key="logs" {...pageTransition} className="w-full pb-20">
                                <LogsSistema />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <FormClienteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}