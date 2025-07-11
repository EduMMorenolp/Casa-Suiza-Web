import { useState } from 'react';
import { Calendar, MapPin, DollarSign, Clock, Users, Heart } from 'lucide-react';
import foto from '../../../assets/foto.png';

interface EventProps {
  title?: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  price?: number;
  image?: string;
  promo?: boolean;
  soldOut?: boolean;
}

interface EventCardProps {
  event: EventProps;
  onBuyClick?: () => void; // ✅ Nuevo
}

export default function EventCard({ event, onBuyClick }: EventCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const safeEvent = {
    ...event,
    title: event.title || 'Evento Casa Suiza',
    date: event.date || '2025-08-15',
    time: event.time || "2hs",
    price: event.price || 8500,
    image: event.image || foto,
    promo: event.promo || false,
    soldOut: event.soldOut || false,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <img
            src={safeEvent.image}
            alt={safeEvent.title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {safeEvent.promo && (
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                🔥 PROMO
              </div>
            </div>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-red-50 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-sm font-medium text-red-600">{formatDate(safeEvent.date)}</span>
              <Clock className="h-4 text-red-600 ml-2" />
              <span className="text-sm font-medium text-red-600">{safeEvent.time}</span>
            </div>
          </div>

          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 mr-2 text-gray-500" />
            <p className="text-gray-700 font-medium">{safeEvent.title}</p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Casa Suiza - La Plata</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                Desde ${safeEvent.price.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${safeEvent.soldOut
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
              }`}
            onClick={() => {
              if (!safeEvent.soldOut && onBuyClick) {
                onBuyClick();
              }
            }}
            disabled={safeEvent.soldOut}
          >
            {safeEvent.soldOut ? '🚫 Agotado' : '🎫 Comprar Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
}
