import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Download,
    Calendar,
    Users,
    DollarSign,
    FileText,
    RefreshCw,
    Eye,
    ChevronDown,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Clock,
    MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const Reportes: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('mes');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Datos de ejemplo para gráficos
    const salesData = [
        { name: 'Ene', ventas: 4000, eventos: 12 },
        { name: 'Feb', ventas: 3000, eventos: 8 },
        { name: 'Mar', ventas: 5000, eventos: 15 },
        { name: 'Abr', ventas: 4500, eventos: 18 },
        { name: 'May', ventas: 6000, eventos: 22 },
        { name: 'Jun', ventas: 5500, eventos: 20 },
        { name: 'Jul', ventas: 7000, eventos: 25 }
    ];

    const eventTypeData = [
        { name: 'Conferencias', value: 35, color: '#3B82F6' },
        { name: 'Workshops', value: 28, color: '#10B981' },
        { name: 'Meetups', value: 20, color: '#F59E0B' },
        { name: 'Seminarios', value: 17, color: '#EF4444' }
    ];

    const topEvents = [
        {
            name: 'Conferencia Tech Summit 2025',
            date: '2025-07-15',
            attendees: 450,
            revenue: '$15,750',
            growth: '+25%',
            trend: 'up',
            location: 'Auditorio Principal'
        },
        {
            name: 'Workshop React Advanced',
            date: '2025-07-22',
            attendees: 120,
            revenue: '$4,200',
            growth: '+18%',
            trend: 'up',
            location: 'Sala 2'
        },
        {
            name: 'Meetup Developers',
            date: '2025-07-28',
            attendees: 85,
            revenue: '$2,550',
            growth: '-5%',
            trend: 'down',
            location: 'Sala 1'
        }
    ];

    const kpiData = [
        {
            title: 'Ingresos Totales',
            value: '$127,450',
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            title: 'Eventos Realizados',
            value: '48',
            change: '+8.2%',
            trend: 'up',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Asistentes Totales',
            value: '2,847',
            change: '+15.3%',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Tasa de Ocupación',
            value: '87%',
            change: '+3.1%',
            trend: 'up',
            icon: Target,
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const handleExport = (format: string) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Aquí iría la lógica real de exportación
            alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
        }, 1500);
    };

    const refreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Reportes & Análisis
                        </h1>
                        <p className="text-gray-600 mt-1">Análisis detallado de eventos y ventas - Casa Suiza</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="semana">Última semana</option>
                            <option value="mes">Último mes</option>
                            <option value="trimestre">Último trimestre</option>
                            <option value="año">Último año</option>
                        </select>

                        <button
                            onClick={refreshData}
                            className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${loading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="relative">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Download className="w-4 h-4" />
                                Exportar
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'overview', label: 'Resumen', icon: BarChart3 },
                        { id: 'sales', label: 'Ventas', icon: DollarSign },
                        { id: 'events', label: 'Eventos', icon: Calendar },
                        { id: 'analytics', label: 'Análisis', icon: TrendingUp }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiData.map((kpi, index) => {
                        const IconComponent = kpi.icon;
                        return (
                            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {kpi.trend === 'up' ? (
                                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                            {kpi.change}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</h3>
                                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ventas por Mes */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Ventas por Mes</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Ingresos</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Distribución por Tipo de Evento */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Tipos de Eventos</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Ver detalles
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <ResponsiveContainer width="100%" height={200}>
                                <RechartsPieChart>
                                    <Tooltip />
                                    <RechartsPieChart>
                                        {eventTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </RechartsPieChart>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3">
                                {eventTypeData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-600">{item.value}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Events */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Eventos Más Exitosos</h3>
                        <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                            Ver todos
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Evento</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Asistentes</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ingresos</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Crecimiento</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topEvents.map((event, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-gray-900">{event.name}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                {event.attendees}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <DollarSign className="w-4 h-4" />
                                                {event.revenue}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className={`flex items-center gap-1 ${event.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {event.trend === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                )}
                                                {event.growth}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white hover:from-red-600 hover:to-red-700 transition-all group"
                    >
                        <FileText className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">Exportar PDF</h3>
                        <p className="text-red-100 text-sm">Genera reporte completo en PDF</p>
                    </button>

                    <button
                        onClick={() => handleExport('excel')}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all group"
                    >
                        <BarChart3 className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">Exportar Excel</h3>
                        <p className="text-green-100 text-sm">Descarga datos en formato Excel</p>
                    </button>

                    <button className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all group">
                        <Clock className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">Programar Reporte</h3>
                        <p className="text-purple-100 text-sm">Configura reportes automáticos</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reportes;