import React from 'react';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 text-white h-full min-h-screen p-4">
            <h2 className="text-xl font-bold mb-6">Casa Suiza</h2>
            <nav className="space-y-2">
                <a href="/admin" className="block px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition">
                    Dashboard
                </a>
                <a href="/admin/eventos" className="block px-4 py-2 hover:bg-gray-700 transition">
                    Gestionar Eventos
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition">
                    Usuarios
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 transition">
                    Configuración
                </a>
            </nav>
        </aside>
    );
}