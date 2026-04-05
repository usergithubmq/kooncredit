import React from 'react';

const LogsSistema = () => {
    // Lista vacía para empezar a trabajar desde cero
    const logsData = [];

    return (
        <div className="flex flex-col h-full space-y-6">

            {/* Contenedor de Tabla con scroll interno */}
            <div className="flex-1 bg-[#051d26] rounded-[1rem] shadow-3xl border border-white/5 overflow-hidden flex flex-col">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-black/20 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                <th className="p-6">STP / Rastreo</th>
                                <th className="p-6">Ordenante</th>
                                <th className="p-6">Beneficiario</th>
                                <th className="p-6">Concepto</th>
                                <th className="p-6 text-center">Status</th>
                                <th className="p-6 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="font-sans">
                            {logsData.length > 0 ? (
                                logsData.map((log, i) => (
                                    <tr key={i} className="border-b border-white/5 text-white">
                                        {/* Aquí irán las celdas */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center opacity-20">
                                            <div className="w-12 h-12 border-2 border-dashed border-white rounded-full animate-spin mb-4" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Esperando transmisiones...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogsSistema;