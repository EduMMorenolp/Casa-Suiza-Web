/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Users, DollarSign, TrendingUp, TrendingDown, Eye, Settings, Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState('mes');
    const [animateStats, setAnimateStats] = useState(false);

    useEffect(() => {
        // Activar animación al cargar
        setTimeout(() => setAnimateStats(true), 100);
    }, []);

    const stats = [
        {
            title: 'Eventos Activos',
            value: '12',
            change: '+2.5%',
            trend: 'up',
            color: 'from-blue-500 to-blue-600',
            icon: Calendar,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Entradas Vendidas',
            value: '1,234',
            change: '+18.2%',
            trend: 'up',
            color: 'from-emerald-500 to-emerald-600',
            icon: BarChart3,
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Usuarios Registrados',
            value: '856',
            change: '+12.1%',
            trend: 'up',
            color: 'from-purple-500 to-purple-600',
            icon: Users,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Ingresos del Mes',
            value: '$45,670',
            change: '-3.4%',
            trend: 'down',
            color: 'from-rose-500 to-rose-600',
            icon: DollarSign,
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-600'
        }
    ];

    const recentEvents = [
        {
            id: 1,
            name: 'Conferencia Tech 2025',
            date: '2025-08-15',
            status: 'Activo',
            attendees: 450,
            revenue: '$12,500',
            statusColor: 'bg-emerald-100 text-emerald-800'
        },
        {
            id: 2,
            name: 'Workshop React Avanzado',
            date: '2025-08-22',
            status: 'Próximo',
            attendees: 120,
            revenue: '$3,600',
            statusColor: 'bg-blue-100 text-blue-800'
        },
        {
            id: 3,
            name: 'Meetup Developers',
            date: '2025-08-28',
            status: 'Planificando',
            attendees: 80,
            revenue: '$2,400',
            statusColor: 'bg-amber-100 text-amber-800'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Dashboard de Eventos
                        </h1>
                        <p className="text-gray-600 mt-1">Resumen de actividad y métricas principales</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="semana">Última semana</option>
                            <option value="mes">Último mes</option>
                            <option value="trimestre">Último trimestre</option>
                        </select>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden ${animateStats ? 'animate-in slide-in-from-bottom-4' : 'opacity-0'
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {stat.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-rose-500" />
                                            )}
                                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Events */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Eventos Recientes</h3>
                        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                            Ver todos
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentEvents.map((event, _index) => (
                            <div
                                key={event.id}
                                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {event.name}
                                        </h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {event.attendees} asistentes
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {event.revenue}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 ${event.statusColor} rounded-full text-sm font-medium`}>
                                        {event.status}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all">
                                        <Settings className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Crear Evento</h3>
                        <p className="text-blue-100 text-sm mb-4">Organiza tu próximo evento</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Comenzar
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Generar Reporte</h3>
                        <p className="text-emerald-100 text-sm mb-4">Analiza tu rendimiento</p>
                        <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                            Generar
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Configuración</h3>
                        <p className="text-purple-100 text-sm mb-4">Personaliza tu dashboard</p>
                        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                            Configurar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;