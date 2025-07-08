import React, { useState } from 'react';
import { createEvent } from '../../../api/events.ts'
import type { EventData } from "../../../api/events.ts";

const AddEventForm: React.FC = () => {
    const [formData, setFormData] = useState<EventData>({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        price: 0,
        imageUrl: '',
        promo: false,
        soldOut: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (!formData.title || !formData.date || !formData.price) {
                setError("Completa título, fecha y precio");
                setLoading(false);
                return;
            }

            const created = await createEvent(formData);
            setSuccessMessage(`Evento "${created.title}" creado con éxito!`);
            setFormData({
                title: "",
                description: "",
                location: "",
                date: "",
                time: "",
                price: 0,
                imageUrl: "",
                promo: false,
                soldOut: false,
            });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error al crear evento");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título del Evento</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Noche de Tango"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                            placeholder="Descripción del evento..."
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lugar</label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Casa Suiza, Buenos Aires"
                        />
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input
                                type="date"
                                value={formData.date || ''}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                            <input
                                type="time"
                                value={formData.time || ''}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                        <input
                            type="number"
                            value={formData.price ?? ''}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="8500"
                            min={0}
                        />
                    </div>

                    {/* URL de Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
                        <input
                            type="url"
                            value={formData.imageUrl || ''}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, promo: e.target.checked })}
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Evento promocional</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.soldOut || false}
                                onChange={(e) => setFormData({ ...formData, soldOut: e.target.checked })}
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Agotado</span>
                        </label>
                    </div>

                    {/* Mostrar error */}
                    {error && (
                        <p className="text-red-600 font-semibold text-center">{error}</p>
                    )}

                    {/* Mostrar éxito */}
                    {successMessage && (
                        <p className="text-green-600 font-semibold text-center">
                            {successMessage}
                        </p>
                    )}

                    {/* Botón */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                    >
                        {loading ? "Creando evento..." : "Agregar Evento"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEventForm;