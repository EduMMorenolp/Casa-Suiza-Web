import EventCard from "./components/EventCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import foto from "../../assets/foto.png"
import foto2 from "../../assets/image.png"


const events = [
  {
    id: 1,
    title: "Edu Schmidt y los enroscas",
    artists: ["Edu Schmidt", "los enroscas"],
    date: "06/04/25",
    time: "21:00hs",
    price: 15000,
    image: foto2,
    promo: true,
  },
  {
    id: 2,
    title: "Roma Ramirez + Néstor Gomez",
    artists: ["Roma Ramirez", "Néstor Gomez"],
    date: "07/05/25",
    time: "21:00hs",
    price: 12000,
    image: foto,
  },
  {
    id: 3,
    title: "Argentas",
    artists: ["Argentas"],
    date: "07/11/25",
    time: "21:00hs",
    price: 10000,
    image: foto,
    promo: true
  },
  {
    id: 4,
    time: "15:00hs",
    image: foto
  }
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
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
