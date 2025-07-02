export default function Hero() {
  return (
    <section className="bg-primary py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Casa Suiza</h1>
      <p className="text-lg md:text-xl mb-6">
        Disfruta de los mejores eventos en La Plata
      </p>
      <a
        href="/eventos"
        className="bg-darkBlue px-6 py-3 rounded-full font-semibold hover:bg-primary transition"
      >
        Ver Próximos Eventos
      </a>
    </section>
  );
}
