import { useState } from 'react';
import { createSubscriber } from '../../../api/subscribers';
import { AxiosError } from 'axios';

export default function Subscriber() {
    // Estados para el formulario de suscripción
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Manejador de envío del formulario de suscripción
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setMessageType('');

        try {
            // Llamada a la API para crear un suscriptor
            await createSubscriber({ subMail: email });
            setMessage('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.');
            setMessageType('success');
            setEmail('');
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || 'Hubo un error al intentar suscribirte. Por favor, inténtalo de nuevo.';
                setMessage(errorMessage);
                setMessageType('error');
            } else {
                console.error('Error inesperado al suscribirse:', error);
                setMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
                setMessageType('error');
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            {/* Newsletter Section */}
            < div className="bg-red-700 border-t border-red-800" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">¡Mantente Informado!</h3>
                        <p className="text-white/90 text-sm mb-4">
                            Suscríbete a nuestro boletín para recibir noticias sobre eventos especiales y ofertas.
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="flex-1 px-4 py-2 rounded-lg bg-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-white text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Suscribiendo...' : 'Suscribirse'}
                            </button>
                        </form>
                        {message && (
                            <p className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div >
        </>
    )
}
