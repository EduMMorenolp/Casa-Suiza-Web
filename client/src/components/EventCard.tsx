import { useState } from 'react';
import BuyModal from "./modals/BuyModal";

// Tipos
interface EventProps {
  title: string;
  artists: string[];
  date: string;
  price: number;
  image: string;
  promo?: boolean;
}

interface TicketType {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function EventCard({ event }: { event: EventProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo para los tipos de entradas
  const ticketTypes: TicketType[] = [
    {
      name: 'Entrada general (Preventa 2)',
      description: 'Las ubicaciones son por orden de llegada.',
      price: 12000,
      quantity: 0,
    },
    {
      name: 'Beneficio x 2 entradas',
      description: 'Compras 1 y recibes 2. Ubicación por orden de llegada.',
      price: 18000,
      quantity: 0,
    },
    {
      name: 'Entrada general (Preventa 1)',
      description: 'Las ubicaciones son por orden de llegada.',
      price: 10000,
      quantity: 0,
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      {/* Bandera de promoción - estilo esquina */}
      {event.promo && (
        <div className="
        absolute top-22 bg-yellow-500 text-white text-lg font-extrabold uppercase
        px-12 py-1 rotate-[-45deg] origin-top-left translate-x-[-15%] 
        shadow-lg
      ">
          PROMO
        </div>
      )}

      {/* Imagen del evento */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />

      {/* Contenido del evento */}
      <div className="p-4">
        {/* Fecha */}
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 12H12v12h0l-6-6h12z" />
          </svg>
          <span className="text-sm text-gray-500">{event.date}</span>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-primary">{event.title}</h3>

        {/* Artistas */}
        <p className="text-darkBlue mt-2">{event.artists.join(' + ')}</p>

        {/* Ubicación */}
        <div className="flex items-center mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 12H12v12h0l-6-6h12z" />
          </svg>
          <span className="text-sm text-gray-500">Casa Suiza</span>
        </div>

        {/* Precio */}
        <div className="flex items-center mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
            <path d="M12 12H12v12h0l-6-6h12z" />
          </svg>
          <span className="text-sm text-gray-500">Desde ${event.price}.-</span>
        </div>

        {/* Botón de compra */}
        <button
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition w-full"
          onClick={() => setIsModalOpen(true)}
        >
          Comprar Tickets
        </button>
      </div>
      {/* Modal de compra */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventName={event.title}
        ticketTypes={ticketTypes}
      />
    </div>
  );
}
