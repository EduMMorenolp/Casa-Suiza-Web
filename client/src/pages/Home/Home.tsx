import EventCard from "./components/EventCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

const events = [
  {
    id: 1,
    title: "Edu Schmidt y los enroscas",
    artists: ["Edu Schmidt", "los enroscas"],
    date: "04 de Julio 2025 a las 21:00",
    price: 12,
    image: "/images/event1.jpg",
    promo: true,
  },
  {
    id: 2,
    title: "Roma Ramirez + Néstor Gomez",
    artists: ["Roma Ramirez", "Néstor Gomez"],
    date: "05 de Julio 2025 a las 21:00",
    price: 12,
    image: "/images/event2.jpg",
  },
  {
    id: 3,
    title: "Argentas",
    artists: ["Argentas"],
    date: "11 de Julio 2025 a las 21:00",
    price: 10,
    image: "/images/event3.jpg",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-darkBlue mb-6 text-center">
          Próximos Eventos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
