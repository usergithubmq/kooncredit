import { useState } from "react";
import api from "../api/axios";

export default function IneUpload() {
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const [previewFront, setPreviewFront] = useState(null);
    const [previewBack, setPreviewBack] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ocrData, setOcrData] = useState(null);

    const handleFrontChange = (e) => {
        const file = e.target.files[0];
        setFront(file);
        setPreviewFront(file ? URL.createObjectURL(file) : null);
    };

    const handleBackChange = (e) => {
        const file = e.target.files[0];
        setBack(file);
        setPreviewBack(file ? URL.createObjectURL(file) : null);
    };

    const uploadINE = async () => {
        if (!front || !back) {
            alert("Sube ambas imágenes de tu INE.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("ine_front", front);
        formData.append("ine_back", back);

        try {
            // Subida
            await api.post("/onboarding/ine/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Procesar OCR / IA
            const res = await api.post("/onboarding/ine/process");

            setOcrData(res.data.ocr_data);

            // Redirigir después de mostrar datos
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);

        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al subir o procesar la INE.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

                {/* Header */}
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Validación de Identidad (INE)
                </h1>
                <p className="text-slate-500 mb-6">
                    Sube la parte frontal y posterior de tu identificación oficial.
                </p>

                {/* Previews */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                            INE Frente
                        </label>
                        <div className="border rounded-lg overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                            {previewFront ? (
                                <img src={previewFront} className="h-full object-cover" />
                            ) : (
                                <span className="text-slate-400">Sin imagen</span>
                            )}
                        </div>
                        <input type="file" className="mt-2" onChange={handleFrontChange} />
                    </div>

                    <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                            INE Reverso
                        </label>
                        <div className="border rounded-lg overflow-hidden bg-slate-50 h-32 flex items-center justify-center">
                            {previewBack ? (
                                <img src={previewBack} className="h-full object-cover" />
                            ) : (
                                <span className="text-slate-400">Sin imagen</span>
                            )}
                        </div>
                        <input type="file" className="mt-2" onChange={handleBackChange} />
                    </div>
                </div>

                {/* OCR DATA */}
                {ocrData && (
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-4">
                        <h3 className="font-bold text-teal-700 mb-2">Datos encontrados:</h3>
                        <p><strong>Nombre:</strong> {ocrData.name}</p>
                        <p><strong>CURP:</strong> {ocrData.curp}</p>
                        <p><strong>Clave Elector:</strong> {ocrData.clave_elector}</p>
                        <p><strong>Vigencia:</strong> {ocrData.vigencia}</p>
                    </div>
                )}

                {/* Submit */}
                <button
                    disabled={loading}
                    onClick={uploadINE}
                    className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                >
                    {loading ? "Procesando..." : "Enviar INE"}
                </button>
            </div>
        </div>
    );
}
