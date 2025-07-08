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
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        {events.length === 0 ? (
          <p className="text-center">No hay eventos disponibles.</p>
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
