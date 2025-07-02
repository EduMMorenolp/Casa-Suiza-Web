export default function Header() {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <img src="/logo.png" alt="Casa Suiza" className="h-10" />
      <nav>
        <ul className="flex gap-6">
          <li>
            <a href="/" className="hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <a href="/eventos" className="hover:text-primary">
              Eventos
            </a>
          </li>
          <li>
            <a href="/contacto" className="hover:text-primary">
              Contacto
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
