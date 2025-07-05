import React from 'react';

interface HeaderProps {
    activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
    const getTitle = (tab: string) => {
        switch (tab) {
            case 'dashboard':
                return 'Dashboard';
            case 'events':
                return 'Eventos';
            case 'add-event':
                return 'Agregar Evento';
            case 'users':
                return 'Usuarios';
            case 'settings':
                return 'Configuración';
            default:
                return 'Dashboard';
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    {getTitle(activeTab)}
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;