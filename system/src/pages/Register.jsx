import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Register() {
    console.log("REGISTER COMPONENT MOUNTED");

    const [form, setForm] = useState({
        name: "",
        first_last: "",
        second_last: "",
        email: "",
        phone: "",
        password: "",
        person_type: "",   // ← se agrega para enviarlo al backend
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isMoral, setIsMoral] = useState(false);

    useEffect(() => {
        const type = localStorage.getItem("person_type");

        if (!type) {
            window.location.href = "/select-person-type";
            return;
        }

        setForm((prev) => ({ ...prev, person_type: type }));
        setIsMoral(type === "moral");
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");
        setLoading(true);
        setErrors({});

        // Normalizamos el teléfono
        const phoneDigits = form.phone.replace(/\D+/g, "");
        console.log("PHONE RAW:", form.phone);
        console.log("PHONE DIGITS:", phoneDigits);

        let phoneNormalized = phoneDigits;
        if (!phoneNormalized.startsWith("52")) {
            phoneNormalized = "52" + phoneNormalized;
        }
        phoneNormalized = "+" + phoneNormalized;

        console.log("PHONE NORMALIZED FRONTEND:", phoneNormalized);

        try {
            const res = await api.post("/register", {
                ...form,
                phone: phoneNormalized,
            });

            console.log("REGISTER RESPONSE PHONE:", res.data.phone);

            // Guardar número normalizado e ID
            localStorage.setItem("pending_phone", phoneNormalized);
            localStorage.setItem("pending_user_id", res.data.user_id);

            window.location.href = "/verify-phone";

        } catch (err) {
            console.log("REGISTER ERROR", err.response?.data);

            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert("Error inesperado");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-[var(--brand-gradient-start)]"
            style={{
                "--brand-blue": "#0c516e",
                "--brand-gradient-start": "#F9F5FF",
                "--brand-gradient-end": "#F4ECFF",
            }}
        >
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* LADO IZQUIERDO */}
                <div className="w-full md:w-1/2 bg-[var(--brand-blue)] flex flex-col items-center justify-center p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 w-full max-w-md text-center md:text-left">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            Impulsa tu futuro financiero.
                        </h1>

                        <p className="text-lg text-white mb-8">
                            Crea tu cuenta y accede a soluciones inteligentes de crédito,
                            control financiero y herramientas diseñadas para crecer.
                        </p>

                        <div className="space-y-5">
                            <div className="flex items-start space-x-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Seguridad garantizada</h3>
                                    <p className="text-white text-sm">
                                        Tu información está protegida con tecnología de nivel bancario.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Acceso inmediato</h3>
                                    <p className="text-white text-sm">
                                        Administra créditos, solicitudes y pagos desde tu panel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORMULARIO */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
                    <div className="w-full max-w-md">
                        <div className="text-left mb-10">
                            <h2 className="text-3xl font-bold text-slate-900">Crea tu cuenta</h2>
                            <p className="text-slate-500 mt-2">
                                Comencemos. Es gratis y solo toma un minuto.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* Nombre */}
                            <div className="relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    className="peer w-full bg-slate-50 border border-[slate-200] text-slate-900 rounded-lg px-4 pt-6 pb-2"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                                >
                                    {isMoral ? "Razón social" : "Nombre completo"}
                                </label>
                            </div>

                            {/* Apellidos SOLO si es persona FÍSICA */}
                            {!isMoral && (
                                <>
                                    <div className="relative">
                                        <input
                                            id="first_last"
                                            name="first_last"
                                            type="text"
                                            value={form.first_last}
                                            onChange={handleChange}
                                            placeholder=" "
                                            required={!isMoral}
                                            className="peer w-full bg-slate-50 border border-[slate-200] text-slate-900 rounded-lg px-4 pt-6 pb-2"
                                        />
                                        <label
                                            htmlFor="first_last"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2"
                                        >
                                            Primer apellido
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <input
                                            id="second_last"
                                            name="second_last"
                                            type="text"
                                            value={form.second_last}
                                            onChange={handleChange}
                                            placeholder=" "
                                            required={!isMoral}
                                            className="peer w-full bg-slate-50 border border-[slate-200] text-slate-900 rounded-lg px-4 pt-6 pb-2"
                                        />
                                        <label
                                            htmlFor="second_last"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2"
                                        >
                                            Segundo apellido
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    className="peer w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 pt-6 pb-2"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2"
                                >
                                    Correo electrónico
                                </label>
                            </div>

                            {/* Teléfono */}
                            <div className="relative">
                                <div className="flex items-stretch bg-slate-50 border border-slate-200 rounded-lg">
                                    <span className="px-4 flex items-center text-slate-500 border-r border-slate-200 bg-slate-100 text-sm">+52</span>
                                    <div className="relative flex-1">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder=" "
                                            required
                                            className="peer w-full bg-slate-50 text-slate-900 rounded-lg px-4 pt-6 pb-2 border-0"
                                        />
                                        <label
                                            htmlFor="phone"
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2"
                                        >
                                            55 1234 5678
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder=" "
                                    required
                                    className="peer w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 pt-6 pb-2 pr-12"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500 bg-slate-50 px-2 transition-all peer-focus:top-2 peer-focus:text-xs peer-not-placeholder-shown:top-2"
                                >
                                    Contraseña
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 border border-slate-300 rounded bg-slate-50"
                                />
                                <label htmlFor="terms" className="ml-3 text-sm font-medium text-slate-600">
                                    Acepto los{" "}
                                    <a href="#" className="text-[var(--brand-blue)]">Términos y Condiciones</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !acceptedTerms}
                                className="w-full text-white bg-[var(--brand-blue)] rounded-lg px-5 py-4 disabled:opacity-60"
                            >
                                {loading ? "Creando cuenta..." : "Crear cuenta"}
                            </button>

                            <div className="text-sm font-medium text-slate-500 text-center">
                                ¿Ya tienes una cuenta?{" "}
                                <a href="/login" className="text-[var(--brand-blue)] font-semibold">
                                    Inicia sesión
                                </a>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
