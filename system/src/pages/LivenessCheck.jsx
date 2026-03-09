import { useState, useRef, useEffect } from "react";

import api from "../api/axios";

export default function LivenessCheck() {
    const videoRef = useRef(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const steps = {
        1: "Mira al frente y mantén tu rostro dentro del recuadro.",
        2: "Gira lentamente tu rostro hacia la derecha.",
        3: "Ahora gira tu rostro hacia la izquierda.",
        4: "Finalmente, sonríe ligeramente."
    };

    useEffect(() => {
        // activar cámara
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => {
                console.error("No se pudo acceder a la cámara", err);
            });
    }, []);

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            finishLiveness(); // ✔️ ahora sí se ejecuta
        }
    };

    const finishLiveness = async () => {
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // animación

            await api.post("/onboarding/liveness", {
                status: "passed",
            });

            window.location.href = "/onboarding/ine/upload";

        } catch (err) {
            console.error(err);
            alert("Error guardando verificación");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center px-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
                {/* Header */}
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Verificación de identidad
                </h1>
                <p className="text-slate-500 mb-6">
                    Antes de continuar, necesitamos confirmar que eres una persona real.
                </p>

                {/* Video */}
                <div className="relative w-full rounded-xl overflow-hidden bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full" />
                    <div className="absolute inset-0 border-4 border-teal-500/40 rounded-xl"></div>
                </div>

                {/* Step instruction */}
                <div className="mt-6 text-center">
                    <p className="text-lg font-semibold text-slate-800">{steps[step]}</p>
                </div>

                {/* Button */}
                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="mt-8 w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-lg transition disabled:opacity-50"
                >
                    {loading ? "Validando..." : step < 4 ? "Continuar" : "Finalizar"}
                </button>

                <p className="text-center text-slate-400 text-sm mt-4">
                    Protección facial avanzada para evitar fraudes.
                </p>
            </div>
        </div>
    );
}
