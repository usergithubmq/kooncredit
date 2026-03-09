import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    DollarSign, ArrowUpRight, CheckCircle, AlertCircle, Calendar
} from 'lucide-react';
import api from '../../api/axios'; // Tu instancia de Axios

const Conciliacion = () => {
    const [data, setData] = useState({
        stats: { total_recibido: 0, pagos_validados: 0, por_conciliar: 0 },
        chartData: [],
        recentPayments: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            // Nota: Aquí llamarías a un endpoint nuevo que cree este concentrado
            const res = await api.get('/client/reporte-conciliacion');
            setData(res.data);
        } catch (err) {
            console.error("Error al cargar reporte", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Conciliación Bancaria</h1>
                <p className="text-gray-500">Resumen de ingresos vía STP y liquidación de contratos</p>
            </div>

            {/* --- KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatCard
                    title="Total Recibido"
                    value={`$${data.stats.total_recibido.toLocaleString()}`}
                    icon={<DollarSign className="text-blue-600" />}
                    color="blue"
                />
                <StatCard
                    title="Pagos Conciliados"
                    value={data.stats.pagos_validados}
                    icon={<CheckCircle className="text-green-600" />}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- GRÁFICA DE INGRESOS --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Flujo de Ingresos (Últimos 7 días)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="monto" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- ÚLTIMOS MOVIMIENTOS --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-4">Últimos Abonos STP</h3>
                    <div className="space-y-4">
                        {data.recentPayments.map((pago, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{pago.nombre_ordenante}</p>
                                    <p className="text-xs text-gray-500">{pago.fecha}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-green-600">+${pago.monto}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{pago.rastreo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`p-3 bg-${color}-50 rounded-lg`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">{title}</p>
            <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
        </div>
    </div>
);

export default Conciliacion;