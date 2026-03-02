import React from "react";
import { FaCopy, FaUserCircle, FaHashtag, FaCalendarAlt, FaSpinner } from "react-icons/fa";

export default function StpAccountsTable({ endUsers, onCopy, loading }) {

    // Función para formatear la CLABE como pidió KoonSystem
    const formatClabe = (clabe) => {
        if (!clabe) return "GENERANDO...";
        return clabe.replace(/^(\d{3})(\d{3})(\d{4})(\d{3})(\d{4})(\d{1})$/, '$1 $2 $3 $4 $5 $6');
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <FaSpinner className="animate-spin text-teal-500 text-3xl" />
        </div>
    );

    return (
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagador / Cliente Final</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Referencia</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuenta CLABE Interbancaria</th>
                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {endUsers.length > 0 ? (
                        endUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <FaUserCircle className="text-slate-300 text-3xl group-hover:text-teal-500 transition-colors" />
                                        <div>
                                            <p className="font-bold text-slate-800 leading-none">{user.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{user.email || 'Sin correo registrado'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                        {user.referencia_interna || 'S/R'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-teal-600 mb-1 uppercase tracking-tighter">STP México</span>
                                        <code className="text-sm font-mono font-black text-[#0c516e] tracking-wider">
                                            {formatClabe(user.clabe_stp)}
                                        </code>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => onCopy(user.clabe_stp)}
                                        className="p-3 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm active:scale-90"
                                        title="Copiar CLABE"
                                    >
                                        <FaCopy />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-20 text-center text-slate-400 font-medium">
                                No tienes pagadores registrados aún. Haz clic en "NUEVO PAGADOR".
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}