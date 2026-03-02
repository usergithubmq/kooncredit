import React, { useEffect, useState } from "react";
import { FaBuilding, FaUser, FaCheckCircle, FaSpinner, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import api from "../../../api/axios";

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);
    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/clients");
            let rawData = res.data;

            // --- LIMPIADOR DE "BASURA" PHP (Deprecated warnings) ---
            // Si lo que recibimos es un string que contiene HTML, buscamos donde empieza el JSON '['
            if (typeof rawData === 'string' && rawData.includes('[{"')) {
                try {
                    const jsonStart = rawData.indexOf('[');
                    rawData = JSON.parse(rawData.substring(jsonStart));
                } catch (parseError) {
                    console.error("Error al limpiar el JSON sucio:", parseError);
                }
            }

            console.log("DATOS LIMPIOS:", rawData);

            // BLINDAJE: Verificamos si la data es un array o viene en .data
            const finalData = Array.isArray(rawData) ? rawData : (rawData.data || []);

            setClients(finalData);
            setError(null);
        } catch (err) {
            console.error("ERROR AXIOS:", err.response);
            setError("Error de conexión. Revisa la consola.");
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    // BLINDAJE: Siempre validamos que 'clients' sea un array antes de filtrar
    const filteredClients = Array.isArray(clients)
        ? clients.filter(c =>
            c.nombre_legal?.toLowerCase().includes(search.toLowerCase()) ||
            c.rfc?.toUpperCase().includes(search.toUpperCase())
        )
        : [];

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <FaSpinner className="animate-spin text-teal-500 text-4xl" />
            <p className="text-slate-400 font-medium animate-pulse">Cargando directorio de clientes...</p>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center">
            <FaExclamationTriangle className="text-red-400 text-3xl mx-auto mb-4" />
            <p className="text-red-700 font-bold">{error}</p>
            <button onClick={fetchClients} className="mt-4 text-sm bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-all font-bold">
                Reintentar conexión
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Buscador Rápido */}
            <div className="relative max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o RFC..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">RFC / Tipo</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CLABE Maestra</th>
                                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl ${client.tipo_cliente === 'empresa' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600'}`}>
                                                    {client.tipo_cliente === 'empresa' ? <FaBuilding /> : <FaUser />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 leading-none">{client.nombre_legal}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{client.user?.email || 'S/E'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-mono font-bold text-slate-600">{client.rfc}</p>
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase font-black">
                                                {client.tipo_cliente === 'empresa' ? 'Moral' : 'Física'}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono text-xs text-[#0c516e] font-bold">
                                            {client.clabe_stp ? (
                                                client.clabe_stp.replace(/^(\d{3})(\d{3})(\d{4})(\d{3})(\d{4})(\d{1})$/, '$1 $2 $3 $4 $5 $6')
                                            ) : (
                                                <span className="text-slate-300 italic">PENDIENTE</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
                                                <FaCheckCircle /> {client.estatus?.toUpperCase() || 'ACTIVO'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <p className="text-slate-400 font-medium">No se encontraron clientes con esos criterios.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}