import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import fotoCasaSuiza from '../../../assets/logoCasaSuiza.png'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/casasuizalp', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/casasuizalp', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/casasuizalp', label: 'Twitter' }
  ];

  return (
    <footer className="bg-custom-red text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={fotoCasaSuiza}
                alt="Casa Suiza"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/90 text-sm max-w-md">
              Sala de conciertos y eventos
            </p>
            <p className="text-white/90 text-sm mb-6 max-w-md">
              Musica - Gastronomía - Bebidas - Amigos
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/80" />
                <div>
                  <p className="text-sm text-white/90">Calle 2 N° 621 e/ 44 y 45</p>
                  <p className="text-sm text-white/90">La Plata, Buenos Aires</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-white/80" />
                <a
                  href="tel:+542214000000"
                  className="text-sm text-white/90 hover:text-white transition-colors duration-200"
                >
                  +54 221 400-0000
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-white/80" />
                <a
                  href="mailto:info@casasuiza.com.ar"
                  className="text-sm text-white/90 hover:text-white transition-colors duration-200"
                >
                  info@casasuiza.com.ar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-red-700 border-t border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">¡Mantente Informado!</h3>
            <p className="text-white/90 text-sm mb-4">
              Suscríbete a nuestro boletín para recibir noticias sobre eventos especiales y ofertas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 rounded-lg bg-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-red-800 border-t border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-white/80">
            <p>© {currentYear} Casa Suiza | Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}