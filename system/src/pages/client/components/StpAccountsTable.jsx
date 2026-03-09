import React, { useState } from "react";
import { FaCopy, FaUserCircle, FaSpinner, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function StpAccountsTable({ endUsers, onCopy, loading, onViewBalance }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Aumenté a 8 porque ahora los renglones son más delgados

    const formatClabe = (clabe) => {
        if (!clabe) return "GENERANDO...";
        return clabe.replace(/^(\d{3})(\d{3})(\d{4})(\d{3})(\d{4})(\d{1})$/, '$1 $2 $3 $4 $5 $6');
    };

    const filteredUsers = endUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.referencia_interna && user.referencia_interna.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    if (loading) return (
        <div className="flex justify-center p-20">
            <FaSpinner className="animate-spin text-teal-500 text-3xl" />
        </div>
    );

    return (
        <div className="space-y-3">
            {/* --- BUSCADOR COMPACTO --- */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-slate-400 text-sm" />
                </div>
                <input
                    type="text"
                    placeholder="Buscar cliente o contrato..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* --- TABLA COMPRIMIDA --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0c516e]">
                        <tr>
                            <th className="py-3 px-6 text-[10px] font-black text-white uppercase tracking-widest">Cliente</th>
                            <th className="py-3 px-6 text-[10px] font-black text-white uppercase tracking-widest">Saldo</th>
                            <th className="py-3 px-6 text-[10px] font-black text-white uppercase tracking-widest text-center">Contrato</th>
                            <th className="py-3 px-6 text-[10px] font-black text-white uppercase tracking-widest">Cuenta CLABE (STP)</th>
                            <th className="py-3 px-6 text-[10px] font-black text-white uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentItems.length > 0 ? (
                            currentItems.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="py-2 px-6">
                                        <div className="flex items-center gap-2">
                                            <FaUserCircle className="text-slate-300 text-xl group-hover:text-teal-500 transition-colors" />
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm leading-tight">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 leading-tight">{user.email || 'Sin correo'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-6">
                                        <button
                                            onClick={() => onViewBalance(user)}
                                            className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black rounded-md hover:bg-teal-600 hover:text-white transition-all uppercase"
                                        >
                                            Consultar
                                        </button>
                                    </td>
                                    <td className="py-2 px-6 text-center">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                            {user.referencia_interna || 'S/R'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-6">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono font-bold text-[#0c516e] tracking-tight bg-slate-50 px-2 py-0.5 rounded">
                                                {formatClabe(user.clabe_stp)}
                                            </code>
                                        </div>
                                    </td>
                                    <td className="py-2 px-6 text-right">
                                        <button
                                            onClick={() => onCopy(user.clabe_stp)}
                                            className="p-2 text-slate-400 hover:text-teal-600 transition-all active:scale-90"
                                            title="Copiar CLABE"
                                        >
                                            <FaCopy />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-400 text-xs italic">
                                    Sin resultados para "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINADOR COMPACTO --- */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white py-2 px-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Página {currentPage} / {totalPages}
                    </span>
                    <div className="flex gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-20 transition-all"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-1.5 rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-20 transition-all"
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}