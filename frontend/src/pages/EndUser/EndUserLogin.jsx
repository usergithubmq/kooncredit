import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/kf3.png';

const EndUserLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Iniciando login para:", formData.email);

        try {
            // TIP: Si usas 'localhost:8000' suele ser más estable en desarrollo local
            const response = await fetch('http://localhost:8000/api/end-user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Respuesta recibida:", data);

            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // IMPORTANTE: Esta ruta debe coincidir con la de tu App.jsx
                navigate('/user-portal');
            } else {
                alert(data.message || "Error de acceso: Credenciales incorrectas");
                setLoading(false); // Desbloqueamos el botón
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor. Verifica que 'php artisan serve' esté activo.");
            setLoading(false); // Desbloqueamos el botón
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fcfcfd] font-sans overflow-hidden">
            {/* LADO IZQUIERDO: DISEÑO */}
            <div className="hidden lg:flex w-1/2 bg-[#0c516e] relative items-center justify-center">
                <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-teal-400/10 rounded-full blur-[120px]"></div>
                <div className="relative z-10 text-center px-12">
                    <img src={Logo} alt="Logo" className="w-24 h-24 object-contain mx-auto mb-8" />
                    <h2 className="text-white text-4xl font-extralight tracking-tight mb-4">Control de <span className="text-teal-400 font-normal italic">Pagos</span></h2>
                    <p className="text-teal-100/40 text-[10px] uppercase tracking-[0.5em]">KoonFinance • 2026</p>
                </div>
            </div>

            {/* LADO DERECHO: FORMULARIO */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full">
                    <header className="mb-12 text-center lg:text-left">
                        <h1 className="text-[#0c516e] text-4xl font-extralight tracking-tighter mb-2">Identidad.</h1>
                        <p className="text-slate-400 font-light text-sm">Gestiona tus depósitos vía STP de forma segura.</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0c516e]/60 ml-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-teal-400/20 outline-none transition-all font-light"
                                placeholder="correo@empresa.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0c516e]/60 ml-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-teal-400/20 outline-none transition-all font-light"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0c516e] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#279a94] transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validando...
                                </span>
                            ) : 'Entrar al Portal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EndUserLogin;