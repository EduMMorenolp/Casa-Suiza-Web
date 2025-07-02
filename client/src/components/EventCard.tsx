interface EventProps {
  title: string;
  date: string;
  price: string;
  image: string;
}

export default function EventCard({ event }: { event: EventProps }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-primary">{event.title}</h3>
        <p className="text-darkBlue">{event.date}</p>
        <p className="mt-2">
          Precio: <span className="font-semibold">${event.price}</span>
        </p>
        <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-darkBlue transition w-full">
          Comprar Entrada
        </button>
      </div>
    </div>
  );
}
