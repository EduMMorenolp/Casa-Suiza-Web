import React, { useState } from 'react';
import { Users as UsersIcon, Search, Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    registrationDate: string;
    status: 'active' | 'inactive';
    ticketsPurchased: number;
    totalSpent: number;
}

interface UserCardProps {
    user: User;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onContact: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onContact }) => {
    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Activo' : 'Inactivo';
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Teléfono:</span> {user.phone}
                        </div>
                        <div>
                            <span className="font-medium">Registro:</span> {user.registrationDate}
                        </div>
                        <div>
                            <span className="font-medium">Entradas:</span> {user.ticketsPurchased}
                        </div>
                        <div>
                            <span className="font-medium">Total gastado:</span> ${user.totalSpent.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onContact(user.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Contactar"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(user.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserStats: React.FC<{ users: User[] }> = ({ users }) => {
    const activeUsers = users.filter(user => user.status === 'active').length;
    const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);
    const avgTicketsPerUser = users.reduce((sum, user) => sum + user.ticketsPurchased, 0) / users.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Usuarios Activos</h3>
                        <p className="text-2xl font-bold text-gray-800">{activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Ingresos Totales</h3>
                        <p className="text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Promedio Entradas</h3>
                        <p className="text-2xl font-bold text-gray-800">{avgTicketsPerUser.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const users: User[] = [
        {
            id: 1,
            name: 'María González',
            email: 'maria@email.com',
            phone: '+54 11 1234-5678',
            registrationDate: '2025-01-15',
            status: 'active',
            ticketsPurchased: 5,
            totalSpent: 42500
        },
        {
            id: 2,
            name: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            phone: '+54 11 9876-5432',
            registrationDate: '2025-02-20',
            status: 'active',
            ticketsPurchased: 3,
            totalSpent: 25500
        },
        {
            id: 3,
            name: 'Ana López',
            email: 'ana@email.com',
            phone: '+54 11 5555-1234',
            registrationDate: '2025-03-10',
            status: 'inactive',
            ticketsPurchased: 1,
            totalSpent: 8500
        },
        {
            id: 4,
            name: 'Roberto Fernández',
            email: 'roberto@email.com',
            phone: '+54 11 7777-8888',
            registrationDate: '2025-01-30',
            status: 'active',
            ticketsPurchased: 8,
            totalSpent: 68000
        },
        {
            id: 5,
            name: 'Laura Martínez',
            email: 'laura@email.com',
            phone: '+54 11 3333-4444',
            registrationDate: '2025-02-14',
            status: 'active',
            ticketsPurchased: 2,
            totalSpent: 17000
        }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (id: number) => {
        console.log('Editar usuario:', id);
    };

    const handleDelete = (id: number) => {
        console.log('Eliminar usuario:', id);
    };

    const handleContact = (id: number) => {
        console.log('Contactar usuario:', id);
    };

    const handleNewUser = () => {
        console.log('Crear nuevo usuario');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
                <button
                    onClick={handleNewUser}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Estadísticas */}
            <UserStats users={users} />

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>

                {/* Lista de usuarios */}
                <div className="space-y-4">
                    {filteredUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onContact={handleContact}
                        />
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron usuarios que coincidan con los filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}