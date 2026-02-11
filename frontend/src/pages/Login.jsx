import { useState } from "react";
import api from "../api/axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", { email, password });

            localStorage.setItem("token", res.data.token);

            window.location.href = "/dashboard";
        } catch (err) {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#e9f7ff] font-semibold">
            {/* SECCIÓN IZQUIERDA – INFO */}
            <div className="w-full md:w-1/2 bg-[#0c516e] text-white flex flex-col items-center justify-center p-10 relative overflow-hidden">

                {/* Círculos decorativos */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold leading-tight mb-6">
                        Bienvenido de nuevo.
                    </h1>
                    <p className="text-lg text-cyan-100 mb-8">
                        Inicia sesión para continuar y acceder a tu panel. Seguro, rápido y sencillo.
                    </p>
                </div>
            </div>

            {/* SECCIÓN DERECHA – FORMULARIO */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
                <div className="w-full max-w-md">

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Inicia sesión
                    </h2>
                    <p className="text-slate-500 mb-10">
                        Ingresa tus credenciales para continuar.
                    </p>

                    <form onSubmit={login} className="space-y-6">

                        {/* Email */}
                        <div className="relative form-input-group">
                            <input
                                id="email"
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="peer w-full bg-slate-50 border border-slate-300 text-slate-900 text-base rounded-lg focus:ring-2 focus:ring-[#0c516e] focus:border-[#0c516e] p-4 transition"
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-base text-slate-500 duration-200 transform -translate-y-4 scale-75 top-4 left-3 
                                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2
                                peer-placeholder-shown:-mt-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-4
                                bg-slate-50 px-1">
                                Correo Electrónico
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative form-input-group">
                            <input
                                id="password"
                                type="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="peer w-full bg-slate-50 border border-slate-300 text-slate-900 text-base rounded-lg focus:ring-2 focus:ring-[#0c516e] focus:border-[#0c516e] p-4 pr-12 transition"
                                required
                            />
                            <label
                                htmlFor="password"
                                className="absolute text-base text-slate-500 duration-200 transform -translate-y-4 scale-75 top-4 left-3 
                                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2
                                peer-placeholder-shown:-mt-3 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:top-4
                                bg-slate-50 px-1">
                                Contraseña
                            </label>

                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 hover:text-slate-700"
                            >
                                <span className="material-symbols-outlined">visibility_off</span>
                            </button>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full text-white bg-[#0c516e] hover:bg-[#084055] focus:ring-4 focus:ring-cyan-200 focus:outline-none font-semibold rounded-lg text-base px-5 py-4 transition-colors"
                        >
                            Iniciar sesión
                        </button>

                        <p className="text-sm font-medium text-slate-500 text-center">
                            ¿No tienes una cuenta?{" "}
                            <a href="/" className="text-[#0c516e] hover:underline font-semibold">
                                Crear una
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
