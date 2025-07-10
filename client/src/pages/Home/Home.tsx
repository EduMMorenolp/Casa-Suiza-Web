import { useEffect, useState } from "react";
import EventCard from "./components/EventCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getEvents } from "../../api/events";
import type { EventData } from "../../api/events";

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dummyEvent: EventData = {
    id: "dummy-1",
    title: "Concierto de prueba",
    description: "Este es un evento de ejemplo porque aún no hay eventos.",
    location: "Casa Suiza, Buenos Aires",
    date: new Date().toISOString(),
    time: "20:00",
    price: 0,
    imageUrl: "https://via.placeholder.com/400x300.png?text=Evento+de+Ejemplo",
    promo: true,
    soldOut: false,
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar eventos");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-8">Cargando eventos...</p>;

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        {events.length === 0 ? (
          <div>
            <p className="text-center mb-4">No hay eventos disponibles.</p>
            <p className="text-center text-sm text-gray-500 mb-4">
              Este es un evento de ejemplo. Iniciá sesión como administrador para crear uno real.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCard key={dummyEvent.id} event={dummyEvent} />
            </div>
            <p className="text-center mt-8 text-red-600">{error}</p>;
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
