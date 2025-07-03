import EventCard from "./components/EventCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import foto from "../../assets/foto.png"

const events = [
  {
    id: 1,
    title: "Edu Schmidt y los enroscas",
    artists: ["Edu Schmidt", "los enroscas"],
    date: "06/04/25",
    price: 15000,
    image: foto,
    promo: true,
  },
  {
    id: 2,
    title: "Roma Ramirez + Néstor Gomez",
    artists: ["Roma Ramirez", "Néstor Gomez"],
    date: "07/05/25",
    price: 12000,
    image: foto,
  },
  {
    id: 3,
    title: "Argentas",
    artists: ["Argentas"],
    date: "07/11/25",
    price: 10000,
    image: foto,
  },
  {
    id: 4,
    image: foto
  }
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
