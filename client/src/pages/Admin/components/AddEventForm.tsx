import React, { useState, useEffect } from "react";
import { createEvent, updateEvent } from "../../../api/events";
import { createCategory, getCategories } from "../../../api/category";
import type { EventData } from "../../../api/events";

// Tipos para categorías
interface Category {
    id: string;
    name: string;
}

interface AddEventFormProps {
    initialData?: EventData;
    onSubmit: (data: EventData, isEdit: boolean) => void;
    onClose: () => void;
    onRedirectToEvents?: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({
    initialData,
    onSubmit,
    onClose,
    onRedirectToEvents
}) => {
    const [formData, setFormData] = useState<EventData>({
        id: "",
        title: "",
        description: "",
        location: "Casa Suiza, La Plata",
        date: "",
        price: 0,
        capacity: 120,
        imageUrl: "",
        promo: false,
        soldOut: false,
        categoryId: "",
        organizerId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Estados para categorías
    const [categories, setCategories] = useState<Category[]>([]);
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Cargar categorías al montar el componente
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };
        loadCategories();
    }, []);

    // Cuando cambian los datos iniciales (edición), los cargamos al form
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setError(null);
            setSuccessMessage(null);
        }
    }, [initialData]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (!formData.title || !formData.date || !formData.price || !formData.capacity || !formData.categoryId) {
                setError("Completa título, fecha, precio, capacidad y categoría");
                setLoading(false);
                return;
            }

            let result: EventData;
            const isEdit = !!formData.id;

            if (isEdit) {
                result = await updateEvent(formData.id!, formData);
                setSuccessMessage(`Evento "${result.title}" actualizado con éxito!`);
            } else {
                result = await createEvent(formData);
                setSuccessMessage(`Evento "${result.title}" creado con éxito!`);
            }

            onSubmit(result, isEdit);

            // Si es creación, reseteamos el form
            if (!isEdit) {
                setFormData({
                    id: "",
                    title: "",
                    description: "",
                    location: "",
                    date: "",
                    price: 0,
                    capacity: 0,
                    imageUrl: "",
                    promo: false,
                    soldOut: false,
                    categoryId: "",
                    organizerId: "",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al guardar evento");
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para crear nueva categoría
    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            setError("El nombre de la categoría es obligatorio");
            return;
        }

        setLoadingCategories(true);
        try {
            const newCategory = await createCategory({ name: newCategoryName.trim() });
            setCategories(prev => [...prev, newCategory]);
            setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
            setNewCategoryName("");
            setShowNewCategoryForm(false);
            setError(null);
        } catch (err) {
            console.error('Error al crear categoría:', err);
            setError("Error al crear la categoría");
        } finally {
            setLoadingCategories(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título del Evento
                        </label>
                        <input
                            type="text"
                            value={formData.title || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Noche de Tango"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                            placeholder="Descripción del evento..."
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lugar
                        </label>
                        <input
                            type="text"
                            value={formData.location || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Casa Suiza, Buenos Aires"
                        />
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={formData.date || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Precio y Capacidad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Precio
                            </label>
                            <input
                                type="number"
                                value={formData.price ?? ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value === "" ? 0 : Number(e.target.value),
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="8500"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacidad
                            </label>
                            <input
                                type="number"
                                value={formData.capacity ?? ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        capacity: e.target.value === "" ? 0 : Number(e.target.value),
                                    })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="100"
                                min={0}
                            />
                        </div>
                    </div>

                    {/* Category ID y Organizer ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <div className="space-y-2">
                                <select
                                    value={formData.categoryId || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, categoryId: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {!showNewCategoryForm ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCategoryForm(true)}
                                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        + Agregar nueva categoría
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Nombre de la categoría"
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCreateCategory}
                                                disabled={loadingCategories}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                                            >
                                                {loadingCategories ? "Creando..." : "Crear"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewCategoryForm(false);
                                                    setNewCategoryName("");
                                                }}
                                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ID de Organizador
                            </label>
                            <input
                                type="text"
                                value={formData.organizerId || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, organizerId: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="organizer-id"
                            />
                        </div>
                    </div>

                    {/* URL de Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL de Imagen
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, imageUrl: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    {/* Promo y SoldOut */}
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.promo || false}
                                onChange={(e) =>
                                    setFormData({ ...formData, promo: e.target.checked })
                                }
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Evento promocional</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.soldOut || false}
                                onChange={(e) =>
                                    setFormData({ ...formData, soldOut: e.target.checked })
                                }
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Agotado</span>
                        </label>
                    </div>

                    {/* Mostrar error */}
                    {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

                    {/* Mostrar éxito */}
                    {successMessage && (
                        <div className="text-center">
                            <p className="text-green-600 font-semibold">{successMessage}</p>
                            <button
                                onClick={() => onRedirectToEvents && onRedirectToEvents()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Ir a Eventos
                            </button>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                        >
                            {loading ? (formData.id ? "Actualizando evento..." : "Guardando evento...") : formData.id ? "Actualizar Evento" : "Agregar Evento"}
                        </button>
                        {formData.id && (
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEventForm;