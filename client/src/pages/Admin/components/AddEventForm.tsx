import React, { useState } from 'react';

interface EventFormData {
    title: string;
    artists: string;
    date: string;
    price: string;
    image: string;
    description: string;
    promo: boolean;
    soldOut: boolean;
}

const AddEventForm: React.FC = () => {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        artists: '',
        date: '',
        price: '',
        image: '',
        description: '',
        promo: false,
        soldOut: false
    });

    const handleSubmit = () => {
        console.log('Evento agregado:', formData);
        // Aquí iría la lógica para agregar el evento
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título del Evento
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Noche de Tango"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Artistas
                        </label>
                        <input
                            type="text"
                            value={formData.artists}
                            onChange={(e) => setFormData({ ...formData, artists: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Ej: Carlos Gardel, Astor Piazzolla"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Precio
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="8500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL de Imagen
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-32"
                            placeholder="Descripción del evento..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.promo}
                                onChange={(e) => setFormData({ ...formData, promo: e.target.checked })}
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Evento promocional</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.soldOut}
                                onChange={(e) => setFormData({ ...formData, soldOut: e.target.checked })}
                                className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Agotado</span>
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                        Agregar Evento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEventForm;