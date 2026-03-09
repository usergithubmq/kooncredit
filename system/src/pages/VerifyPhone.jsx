import { useState, useEffect } from "react";
import api from "../api/axios";

export default function VerifyPhone() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    let rawPhone = localStorage.getItem("pending_phone") || "";

    if (!rawPhone || rawPhone === "undefined") {
        window.location.href = "/register";
        return null;
    }

    // Limpieza y normalización para mostrar al usuario
    const cleanPhone = rawPhone.replace(/\D+/g, "");

    const maskedPhone =
        cleanPhone.length >= 10
            ? cleanPhone.slice(0, 2) + " ** *** " + cleanPhone.slice(-2)
            : cleanPhone;

    useEffect(() => {
        if (!rawPhone) {
            setError("No hay número pendiente para verificar. Registra tu cuenta nuevamente.");
        }
    }, [rawPhone]);

    const verify = async () => {
        setError("");

        if (!rawPhone) {
            setError("Número no encontrado. Intenta registrarte otra vez.");
            return;
        }

        // Normalizamos el número ANTES de enviarlo
        let phoneNormalized = cleanPhone;

        if (!phoneNormalized.startsWith("52")) {
            phoneNormalized = "52" + phoneNormalized;
        }

        phoneNormalized = "+" + phoneNormalized;

        console.log("PHONE STORED RAW:", rawPhone);
        console.log("PHONE CLEAN:", cleanPhone);
        console.log("PHONE NORMALIZED SENT TO BACKEND:", phoneNormalized);
        console.log("CODE:", code);

        try {
            const res = await api.post("/verify-code", {
                phone: phoneNormalized,
                code: code,
            });

            localStorage.setItem("token", res.data.token);

            alert("Teléfono verificado correctamente ✅");
            console.log("RES DATA TOKEN:", res.data.token);


            localStorage.removeItem("pending_phone");
            localStorage.removeItem("pending_user_id");

            console.log("RESPUESTA DEL BACKEND COMPLETA:", res.data);
            console.log("TOKEN RECIBIDO:", res.data.token);


            window.location.href = "/onboarding/liveness";
        } catch (err) {
            console.error("VERIFY ERROR:", err.response?.data);

            setError(
                err.response?.data?.message ||
                "Código incorrecto, expirado o número no coincide."
            );
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-950 text-white px-4">
            <div className="w-full max-w-md bg-slate-900/90 p-8 rounded-3xl shadow-xl border border-white/10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                    Verificar teléfono
                </h1>

                <p className="text-center text-slate-400 mb-6 text-sm">
                    Enviamos un código por SMS al número{" "}
                    <span className="font-semibold text-slate-200">{maskedPhone}</span>.
                </p>

                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Código de 6 dígitos"
                    maxLength={6}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 mb-3 text-center tracking-[0.3em] text-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 outline-none"
                />

                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

                <button
                    onClick={verify}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 py-3 rounded-xl font-semibold text-slate-900 shadow-emerald-500/20 shadow-lg transition"
                >
                    Verificar
                </button>
            </div>
        </div>
    );
}
