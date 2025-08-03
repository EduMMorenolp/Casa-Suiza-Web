import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, Plus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { getUsersWithStats } from '../../../api/users';

interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: string;
    ticketsPurchased: number;
    totalSpent: number;
    orderCount: number;
}

interface UserCardProps {
    user: User;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onContact: (id: string) => void;
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
                            <h3 className="font-semibold text-gray-800">{user.username}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Rol:</span> {user.role}
                        </div>
                        <div>
                            <span className="font-medium">Registro:</span> {new Date(user.createdAt).toLocaleDateString()}
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                        {getStatusText(user.isActive ? 'active' : 'inactive')}
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
    const activeUsers = users.filter(user => user.isActive).length;
    const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);
    const avgTicketsPerUser = users.length > 0 ? users.reduce((sum, user) => sum + user.ticketsPurchased, 0) / users.length : 0;

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
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsersWithStats();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const mockUsers: User[] = [
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
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || 
            (filterStatus === 'active' && user.isActive) ||
            (filterStatus === 'inactive' && !user.isActive);
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (id: string) => {
        console.log('Editar usuario:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Eliminar usuario:', id);
    };

    const handleContact = (id: string) => {
        console.log('Contactar usuario:', id);
    };

    const handleNewUser = () => {
        console.log('Crear nuevo usuario');
    };

    return (
        <div className="space-y-6 p-4">
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
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Cargando usuarios...
                        </div>
                    ) : (
                        <>
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onContact={handleContact}
                                />
                            ))}

                            {filteredUsers.length === 0 && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron usuarios que coincidan con los filtros.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}