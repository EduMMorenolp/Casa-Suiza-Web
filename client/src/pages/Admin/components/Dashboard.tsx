import React from 'react';
import { BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
    const stats = [
        { title: 'Eventos Activos', value: '12', color: 'bg-blue-500' },
        { title: 'Entradas Vendidas', value: '1,234', color: 'bg-green-500' },
        { title: 'Usuarios Registrados', value: '856', color: 'bg-purple-500' },
        { title: 'Ingresos del Mes', value: '$45,670', color: 'bg-red-600' }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Eventos Recientes</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-800">Evento {i}</h4>
                                <p className="text-sm text-gray-600">Fecha: 2025-08-{10 + i}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Activo
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;