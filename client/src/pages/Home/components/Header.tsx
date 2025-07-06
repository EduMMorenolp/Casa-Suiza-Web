import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import fotoCasaSuiza from "../../../assets/logoCasaSuiza.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: "/", label: "Inicio", active: true },
    { href: "#contacto", label: "Contacto", active: false },
    { href: "/login", label: "Login", active: true },
  ];

  return (
    <header
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-custom-red backdrop-blur-md shadow-lg"
          : "bg-custom-red"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 group">
          <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={fotoCasaSuiza}
                  alt="Casa Suiza"
                  className="h-8 md:h-12 w-auto transition-transform duration-300 >group-hover:scale-110"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                      item.active
                        ? "text-white font-semibold"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                        item.active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-red-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 bg-custom-red backdrop-blur-md border-t border-red-800">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  item.active
                    ? "bg-white text-red-600"
                    : "text-white hover:bg-red-800 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
