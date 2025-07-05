import React from 'react';
import { Calendar, BarChart3, Users, Eye } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    color: string;
    icon: React.ElementType;
}

interface Event {
    id: number;
    title: string;
    date: string;
    status: string;
    tickets: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Activo': return 'bg-green-100 text-green-800';
            case 'Agotado': return 'bg-red-100 text-red-800';
            case 'Próximo': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
                <h4 className="font-medium text-gray-800">{event.title}</h4>
                <p className="text-sm text-gray-600">Fecha: {event.date}</p>
                <p className="text-sm text-gray-600">Entradas vendidas: {event.tickets}</p>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                    {event.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Eye className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const stats = [
        { title: 'Eventos Activos', value: '12', color: 'bg-blue-500', icon: Calendar },
        { title: 'Entradas Vendidas', value: '1,234', color: 'bg-green-500', icon: BarChart3 },
        { title: 'Usuarios Registrados', value: '856', color: 'bg-purple-500', icon: Users },
        { title: 'Ingresos del Mes', value: '$45,670', color: 'bg-red-600', icon: BarChart3 }
    ];

    const recentEvents: Event[] = [
        { id: 1, title: 'Noche de Tango', date: '2025-08-15', status: 'Activo', tickets: 45 },
        { id: 2, title: 'Jazz en Casa Suiza', date: '2025-08-20', status: 'Agotado', tickets: 100 },
        { id: 3, title: 'Folklore Argentino', date: '2025-08-25', status: 'Activo', tickets: 23 },
        { id: 4, title: 'Milonga de Abril', date: '2025-08-30', status: 'Próximo', tickets: 0 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <div className="text-sm text-gray-600">
                    Última actualización: {new Date().toLocaleTimeString('es-AR')}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Eventos Recientes</h3>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Ver todos
                    </button>
                </div>

                <div className="space-y-3">
                    {recentEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
}