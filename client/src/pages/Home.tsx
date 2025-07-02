import EventCard from "../components/EventCard";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const events = [
  {
    title: "Noche de Jazz",
    date: "15 de Mayo de 2025",
    price: "500",
    image: "https://via.placeholder.com/400x200 ",
  },
  {
    title: "DJ Set Electrónico",
    date: "22 de Mayo de 2025",
    price: "700",
    image: "https://via.placeholder.com/400x200 ",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-darkBlue mb-6">
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
