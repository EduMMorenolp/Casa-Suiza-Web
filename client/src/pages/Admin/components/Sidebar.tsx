import React from 'react';
import { Plus, Users, Calendar, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'events', label: 'Eventos', icon: Calendar },
        { id: 'add-event', label: 'Agregar Evento', icon: Plus },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-full">
            {/* Header del sidebar */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Casa Suiza</h2>
                <p className="text-sm text-gray-600">Panel de Administración</p>
            </div>

            {/* Menú de navegación */}
            <nav className="mt-6">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeTab === item.id
                            ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Logout button */}
            <div className="absolute bottom-4 left-4 right-4">
                <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;