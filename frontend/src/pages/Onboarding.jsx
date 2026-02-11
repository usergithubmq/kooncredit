import React, { useState } from "react";

export default function Onboarding() {
    const [ineStatus, setIneStatus] = useState("pendiente");
    const [livenessStatus, setLivenessStatus] = useState("pendiente");
    const [addressStatus, setAddressStatus] = useState("pendiente");

    const allDone =
        ineStatus === "completo" &&
        livenessStatus === "completo" &&
        addressStatus === "completo";

    // Aquí luego conectas tu lógica real
    const handleIneUpload = () => {
        // TODO: abrir modal / file input
        setIneStatus("completo");
    };

    const handleLiveness = () => {
        // TODO: abrir flujo de selfie / video
        setLivenessStatus("completo");
    };

    const handleAddressUpload = () => {
        // TODO: subir comprobante PDF/JPG
        setAddressStatus("completo");
    };

    const handleContinue = () => {
        if (!allDone) return;
        // Aquí rediriges al dashboard cuando termines la validación del backend
        window.location.href = "/dashboard";
    };

    const getPill = (status) => {
        if (status === "completo") {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <span className="material-symbols-outlined text-sm mr-1">
                        check_circle
                    </span>
                    Completado
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                <span className="material-symbols-outlined text-sm mr-1">
                    schedule
                </span>
                Pendiente
            </span>
        );
    };

    return (
        <div className="bg-[var(--brand-gradient-start)] min-h-screen flex flex-col md:flex-row">
            {/* LADO IZQUIERDO BRANDING */}
            <div className="w-full md:w-1/2 bg-[var(--brand-blue)] flex flex-col items-center justify-center p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 w-full max-w-md text-center md:text-left">
                    <a className="inline-flex items-center space-x-3 mb-10" href="#">
                        <span className="bg-white p-2.5 rounded-full">
                            <span className="material-symbols-outlined text-[var(--brand-blue)] !text-3xl">
                                hub
                            </span>
                        </span>
                        <span className="text-3xl font-bold">KoonCredit</span>
                    </a>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        Terminemos de conocerte.
                    </h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Antes de activar tu línea de crédito necesitamos validar tu
                        identidad y tu domicilio. Es un proceso rápido, seguro y 100%
                        en línea.
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-white/10 p-2 rounded-full mt-1">
                                <span className="material-symbols-outlined text-white">
                                    shield_lock
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Protegemos tu identidad</h3>
                                <p className="text-blue-100 text-sm">
                                    Usamos verificación de INE, selfie y liveness check para
                                    asegurarnos de que solo tú puedas usar tu cuenta.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-white/10 p-2 rounded-full mt-1">
                                <span className="material-symbols-outlined text-white">
                                    bolt
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Proceso ágil</h3>
                                <p className="text-blue-100 text-sm">
                                    Toma pocos minutos: subes tu INE, haces una selfie guiada y
                                    cargas tu comprobante de domicilio. Te avisamos cuando quede
                                    aprobado.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO STEPS */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
                <div className="w-full max-w-xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">
                            Completa tu verificación
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Son solo tres pasos para activar tu crédito. Ten a la mano tu INE,
                            tu celular con cámara y un comprobante de domicilio reciente.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Paso 1: Liveness */}
                        <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                        2
                                    </span>
                                    <h3 className="font-semibold text-slate-900">
                                        Selfie + liveness check
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Te pediremos una selfie en tiempo real (parpadear, girar la
                                    cabeza, etc.) para confirmar que eres una persona real y no
                                    una foto o grabación.
                                </p>
                                <div className="mt-2">{getPill(livenessStatus)}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLiveness}
                                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                                Iniciar selfie
                            </button>
                        </div>


                        {/* Paso 2: INE */}
                        <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                        1
                                    </span>
                                    <h3 className="font-semibold text-slate-900">
                                        Sube tu INE (frente y reverso)
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Tomaremos una foto clara de tu identificación oficial para
                                    validar que los datos coincidan contigo.
                                </p>
                                <div className="mt-2">{getPill(ineStatus)}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleIneUpload}
                                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                                Subir INE
                            </button>
                        </div>
                        {/* Paso 3: Comprobante domicilio */}
                        <div className="border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                                        3
                                    </span>
                                    <h3 className="font-semibold text-slate-900">
                                        Comprobante de domicilio
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-500">
                                    Sube un recibo de luz, agua, teléfono o estado de cuenta
                                    bancario no mayor a 3 meses. El domicilio debe coincidir con
                                    el de tu solicitud.
                                </p>
                                <div className="mt-2">{getPill(addressStatus)}</div>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddressUpload}
                                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                            >
                                Subir comprobante
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!allDone}
                        className="mt-8 w-full text-white bg-[var(--brand-blue)] hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-slate-300 font-semibold rounded-lg text-base px-5 py-4 text-center transition-colors duration-300 disabled:opacity-50"
                    >
                        {allDone
                            ? "Continuar al dashboard"
                            : "Completa los pasos para continuar"}
                    </button>

                    <p className="text-xs text-slate-400 mt-4 text-center">
                        Al continuar aceptas nuestro tratamiento de datos personales
                        conforme al aviso de privacidad de KoonCredit.
                    </p>
                </div>
            </div>
        </div>
    );
}
