interface EventProps {
  title: string;
  artists: string[];
  date: string;
  price: number;
  image: string;
  promo?: boolean;
}

export default function EventCard({ event }: { event: EventProps }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Bandera de promoción */}
      {event.promo && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-white px-4 py-2 transform -translate-y-full">
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
        <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition w-full">
          Comprar Tickets
        </button>
      </div>
    </div>
  );
}
