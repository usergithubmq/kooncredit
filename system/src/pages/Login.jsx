import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para la navegación fluida
import api from "../api/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // src/pages/Login.jsx

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", { email, password });
            let rawData = res.data;

            // 1. LIMPIEZA DE RUIDO PHP (Si es un string sucio, extraemos solo el JSON)
            if (typeof rawData === "string" && rawData.includes("{")) {
                const jsonPart = rawData.substring(rawData.indexOf("{"));
                try {
                    rawData = JSON.parse(jsonPart);
                } catch (e) {
                    console.error("No se pudo limpiar el JSON:", e);
                }
            }

            console.log("Datos limpios para usar:", rawData);

            if (rawData && rawData.user) {
                const userRole = rawData.user.role;
                localStorage.setItem("token", rawData.token);
                localStorage.setItem("role", userRole);

                if (userRole === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/client/dashboard");
                }
            } else {
                alert("Error: No se recibió el objeto de usuario tras la limpieza.");
            }
        } catch (err) {
            console.error("Error en login:", err);
            alert("Credenciales incorrectas o error de servidor.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#e9f7ff] font-semibold">
            {/* SECCIÓN IZQUIERDA – INFO */}
            <div className="w-full md:w-1/2 bg-[#0c516e] text-white flex flex-col items-center justify-center p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold leading-tight mb-6">Bienvenido de nuevo.</h1>
                    <p className="text-lg text-cyan-100 mb-8">Inicia sesión para continuar y acceder a tu panel. Seguro, rápido y sencillo.</p>
                </div>
            </div>

            {/* SECCIÓN DERECHA – FORMULARIO */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Inicia sesión</h2>
                    <p className="text-slate-500 mb-10">Ingresa tus credenciales para continuar.</p>

                    <form onSubmit={login} className="space-y-6">
                        {/* Email */}
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full bg-slate-50 border border-slate-300 text-slate-900 text-base rounded-lg focus:ring-2 focus:ring-[#0c516e] focus:border-[#0c516e] p-4 transition outline-none"
                                required
                            />
                            <label htmlFor="email" className="absolute text-base text-slate-500 duration-200 transform -translate-y-4 scale-75 top-4 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-mt-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-4 bg-slate-50 px-1 pointer-events-none">
                                Correo Electrónico
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full bg-slate-50 border border-slate-300 text-slate-900 text-base rounded-lg focus:ring-2 focus:ring-[#0c516e] focus:border-[#0c516e] p-4 pr-12 transition outline-none"
                                required
                            />
                            <label htmlFor="password" className="absolute text-base text-slate-500 duration-200 transform -translate-y-4 scale-75 top-4 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-mt-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-4 bg-slate-50 px-1 pointer-events-none">
                                Contraseña
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-700"
                            >
                                <span className="material-icons-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                            </button>
                        </div>

                        <button type="submit" className="w-full text-white bg-[#0c516e] hover:bg-[#084055] focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg text-base px-5 py-4 transition-all">
                            Iniciar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}