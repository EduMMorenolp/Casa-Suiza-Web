import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    date: string;
    status: 'active' | 'soldout' | 'upcoming';
    sold: number;
    total: number;
    price: number;
}

interface EventCardProps {
    event: Event;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

interface SearchFiltersProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    filterStatus: string;
    onFilterChange: (status: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onView, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'soldout': return 'bg-red-100 text-red-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'soldout': return 'Agotado';
            case 'upcoming': return 'Próximo';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">{event.title}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Fecha:</span> {event.date}
                        </div>
                        <div>
                            <span className="font-medium">Precio:</span> ${event.price.toLocaleString()}
                        </div>
                        <div>
                            <span className="font-medium">Vendidas:</span> {event.sold}/{event.total}
                        </div>
                        <div>
                            <span className="font-medium">Disponibles:</span> {event.total - event.sold}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onView(event.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(event.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(event.id)}
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

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar eventos..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
            </div>

            <select
                value={filterStatus}
                onChange={(e) => onFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="soldout">Agotados</option>
                <option value="upcoming">Próximos</option>
            </select>
        </div>
    );
};

export default function Events() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const events: Event[] = [
        { id: 1, title: 'Noche de Tango', date: '2025-08-15', status: 'active', sold: 45, total: 100, price: 8500 },
        { id: 2, title: 'Jazz en Casa Suiza', date: '2025-08-20', status: 'soldout', sold: 100, total: 100, price: 9000 },
        { id: 3, title: 'Folklore Argentino', date: '2025-08-25', status: 'active', sold: 23, total: 80, price: 7500 },
        { id: 4, title: 'Milonga de Abril', date: '2025-08-30', status: 'upcoming', sold: 0, total: 120, price: 8000 },
        { id: 5, title: 'Concierto de Cuarteto', date: '2025-09-05', status: 'active', sold: 67, total: 150, price: 10000 }
    ];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleView = (id: number) => {
        console.log('Ver evento:', id);
        // Implementar lógica para ver detalles
    };

    const handleEdit = (id: number) => {
        console.log('Editar evento:', id);
        // Implementar lógica para editar
    };

    const handleDelete = (id: number) => {
        console.log('Eliminar evento:', id);
        // Implementar lógica para eliminar
    };

    const handleNewEvent = () => {
        console.log('Crear nuevo evento');
        // Implementar navegación al formulario
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Eventos</h2>
                <button
                    onClick={handleNewEvent}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                </button>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <SearchFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                    />
                </div>

                {/* Lista de eventos */}
                <div className="space-y-4">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron eventos que coincidan con los filtros.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}