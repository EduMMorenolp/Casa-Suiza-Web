import React, { useState } from 'react';

interface EventFormData {
    title: string;
    artists: string;
    date: string;
    time: string;
    price: number;
    image: string;
    promo: boolean;
}

export default function AddEventForm() {
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        artists: '',
        date: '',
        time: '',
        price: 0,
        image: '',
        promo: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes enviarlo al backend o mostrar en consola
        console.log('Evento creado:', formData);
        alert('Evento guardado (simulado)');
        setFormData({
            title: '',
            artists: '',
            date: '',
            time: '',
            price: 0,
            image: '',
            promo: false,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Agregar Evento</h3>

            <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded px-3 py-2"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Artistas (separados por comas)</label>
                <input
                    type="text"
                    name="artists"
                    value={formData.artists}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded px-3 py-2"
                    placeholder="Ej: Artista1, Artista2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded px-3 py-2"
                        placeholder="Ej: 04/07/25"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Hora</label>
                    <input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded px-3 py-2"
                        placeholder="Ej: 21:00hs"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Precio</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded px-3 py-2"
                    step="any"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Imagen (URL)</label>
                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded px-3 py-2"
                    placeholder="https://ejemplo.com/imagen.jpg "
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="promo"
                    name="promo"
                    checked={formData.promo}
                    onChange={handleChange}
                    className="mr-2"
                />
                <label htmlFor="promo">Promo</label>
            </div>

            <button
                type="submit"
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
            >
                Guardar Evento
            </button>
        </form>
    );
}