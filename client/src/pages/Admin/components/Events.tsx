import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import type { EventData } from "../../../api/events";
import { getEvents, deleteEvent } from "../../../api/events";
import AddEventForm from "./AddEventForm";

interface Event extends EventData {
    status: "active" | "soldout";
    sold: number;
}

interface EventsProps {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

function getStatus(soldOut?: boolean): "active" | "soldout" {
    return soldOut ? "soldout" : "active";
}

const Events: React.FC<EventsProps> = ({ setActiveTab }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "soldout">("all");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            setError(null);
            try {
                const data = await getEvents();
                const mapped = data.map((e) => ({
                    ...e,
                    status: getStatus(e.soldOut),
                    sold: Math.floor(Math.random() * 100), 
                }));
                setEvents(mapped);
            } catch (e) {
                if (e instanceof Error) setError(e.message);
                else setError("Error desconocido");

                // Eventos dummy para fallback
                const dummyEvents: Event[] = [
                    {
                        id: "dummy-1",
                        title: "Concierto Test 1",
                        description: "Evento de prueba 1",
                        location: "Lugar Test 1",
                        date: new Date().toISOString(),
                        time: "20:00",
                        price: 1000,
                        imageUrl: "",
                        promo: false,
                        soldOut: false,
                        status: "active",
                        sold: 20,
                    },
                    {
                        id: "dummy-2",
                        title: "Concierto Test 2",
                        description: "Evento de prueba 2",
                        location: "Lugar Test 2",
                        date: new Date().toISOString(),
                        time: "21:00",
                        price: 1500,
                        imageUrl: "",
                        promo: true,
                        soldOut: false,
                        status: "active",
                        sold: 50,
                    },
                    {
                        id: "dummy-3",
                        title: "Concierto Test 3",
                        description: "Evento de prueba 3",
                        location: "Lugar Test 3",
                        date: new Date().toISOString(),
                        time: "22:00",
                        price: 2000,
                        imageUrl: "",
                        promo: false,
                        soldOut: true,
                        status: "soldout",
                        sold: 100,
                    },
                ];

                setEvents(dummyEvents);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Filtrado
    const filteredEvents = events.filter((event) => {
        const matchesStatus = filterStatus === "all" || event.status === filterStatus;
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.date.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    // Delete handler
    const handleDelete = async (id?: string) => {
        if (!id) {
            alert("ID del evento no válido");
            return;
        }
        const confirmed = window.confirm("¿Estás seguro que deseas eliminar este evento?");
        if (!confirmed) return;

        try {
            await deleteEvent(id);
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            alert(error instanceof Error ? error.message : "Error desconocido al eliminar");
        }
    };

    // Abrir formulario para crear nuevo evento
    const handleNewEvent = () => {
        setActiveTab('add-event');
    };

    // Abrir formulario para editar
    const handleEditEvent = (event: EventData) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    // Callback cuando se crea o actualiza un evento desde el formulario
    const handleFormSubmit = async (eventData: EventData, isEdit: boolean) => {
        setShowForm(false);
        if (isEdit) {
            setEvents((prev) =>
                prev.map((e) => (e.id === eventData.id ? { ...eventData, status: getStatus(eventData.soldOut), sold: e.sold } : e))
            );
        } else {
            setEvents((prev) => [
                ...prev,
                { ...eventData, status: getStatus(eventData.soldOut), sold: 0 },
            ]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Eventos</h2>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    onClick={handleNewEvent}
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                </button>
            </div>

            {/* Mostrar formulario solo si showForm es true */}
            {showForm && (
                <AddEventForm
                    initialData={editingEvent || undefined}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar eventos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value as "all" | "active" | "soldout")
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="soldout">Agotados</option>
                    </select>
                </div>

                {loading && <p className="text-center text-gray-600">Cargando eventos...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                {!loading && (
                    <div className="space-y-3">
                        {filteredEvents.length === 0 ? (
                            <p className="text-center text-gray-600">No hay eventos para mostrar.</p>
                        ) : (
                            filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            Fecha: {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">Entradas vendidas: {event.sold}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${event.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {event.status === "active" ? "Activo" : "Agotado"}
                                        </span>
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                            onClick={() => handleEditEvent(event)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            onClick={() => handleDelete(event.id!)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
