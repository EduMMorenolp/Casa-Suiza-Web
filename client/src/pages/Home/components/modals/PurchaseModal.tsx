import { useState, useEffect, useCallback } from "react";
import { X, User, Mail, Phone, CreditCard, ShoppingCart, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

import { createTicket } from "../../../../api/tickets";
import { createOrder } from "../../../../api/orders";
import type { OrderData } from "../../../../api/orders";
import { createPaymentPreference } from "../../../../api/payments";
import { AxiosError } from "axios";

interface PurchaseModalProps {
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
    ticketPrice: number;
    onClose: () => void;
    userId?: string;
}

export default function PurchaseModal({
    isOpen,
    eventId,
    eventTitle,
    ticketPrice,
    onClose,
    userId,
}: PurchaseModalProps) {
    // Estados del formulario
    const [buyerName, setBuyerName] = useState("");
    const [buyerLastName, setBuyerLastName] = useState("");
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");
    const [buyerDni, setBuyerDni] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Estados de control
    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Validación en tiempo real 
    const validateField = (field: string, value: string) => {
        const errors = { ...fieldErrors };

        switch (field) {
            case 'buyerName':
                if (!value.trim()) errors.buyerName = 'El nombre es obligatorio';
                else if (value.length < 2) errors.buyerName = 'El nombre debe tener al menos 2 caracteres';
                else delete errors.buyerName;
                break;
            case 'buyerLastName':
                if (!value.trim()) errors.buyerLastName = 'El apellido es obligatorio';
                else if (value.length < 2) errors.buyerLastName = 'El apellido debe tener al menos 2 caracteres';
                else delete errors.buyerLastName;
                break;
            case 'buyerEmail': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) errors.buyerEmail = 'El email es obligatorio';
                else if (!emailRegex.test(value)) errors.buyerEmail = 'Ingresa un email válido';
                else delete errors.buyerEmail;
                break;
            }
            case 'buyerDni':
                if (!value.trim()) errors.buyerDni = 'El DNI es obligatorio';
                else if (!/^\d{7,8}$/.test(value)) errors.buyerDni = 'El DNI debe tener 7 u 8 dígitos';
                else delete errors.buyerDni;
                break;
            case 'buyerPhone':
                if (value && !/^\d{8,15}$/.test(value.replace(/\s+/g, ''))) {
                    errors.buyerPhone = 'Ingresa un teléfono válido (8 a 15 dígitos)';
                } else delete errors.buyerPhone;
                break;
        }

        setFieldErrors(errors);
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'buyerName': setBuyerName(value); break;
            case 'buyerLastName': setBuyerLastName(value); break;
            case 'buyerEmail': setBuyerEmail(value); break;
            case 'buyerPhone': setBuyerPhone(value); break;
            case 'buyerDni': setBuyerDni(value); break;
        }
        validateField(field, value);
    };

    // Memoizar resetForm para que sea una función estable
    const resetForm = useCallback(() => {
        setBuyerName("");
        setBuyerLastName("");
        setBuyerEmail("");
        setBuyerPhone("");
        setBuyerDni("");
        setQuantity(1);
        setStep('form');
        setError(null);
        setFieldErrors({});
        setPaymentUrl(null);
        setOrderData(null);
    }, []);

    // Memoizar handleClose para que sea una función estable
    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);


    const handleSubmit = async () => {
        // Validar todos los campos
        validateField('buyerName', buyerName);
        validateField('buyerLastName', buyerLastName);
        validateField('buyerEmail', buyerEmail);
        validateField('buyerDni', buyerDni);
        if (buyerPhone) validateField('buyerPhone', buyerPhone);

        // Verificar si hay errores después de la validación
        const currentFieldErrors = { ...fieldErrors };
        const hasErrors = Object.keys(currentFieldErrors).some(key => currentFieldErrors[key]);

        if (hasErrors || !buyerName || !buyerLastName || !buyerEmail || !buyerDni) {
            setError("Por favor corrige los errores antes de continuar.");
            return;
        }

        if (quantity < 1) {
            setError("La cantidad de entradas debe ser al menos 1.");
            return;
        }

        const currentUserId = userId || 'anonymous-user-id';

        setError(null);
        setLoading(true);

        try {
            const ticketIds: number[] = [];
            // Paso 1: Crear múltiples tickets (uno por cada cantidad)
            for (let i = 0; i < quantity; i++) {
                const newTicket = await createTicket({
                    eventId,
                    buyerName,
                    buyerLastName,
                    buyerEmail,
                    buyerPhone: buyerPhone || null,
                    buyerDni,
                });
                ticketIds.push(newTicket.id);
            }

            // Paso 2: Crear una orden con los IDs de los tickets
            const order = await createOrder({
                userId: currentUserId,
                ticketIds: ticketIds,
            });
            setOrderData(order);

            // Paso 3: Crear la preferencia de pago usando el ID de la orden
            const { initPoint } = await createPaymentPreference({
                orderId: order.id,
            });

            setPaymentUrl(initPoint);
            setStep('payment');
        } catch (e: unknown) {
            console.error("Error en el proceso de compra:", e);
            if (e instanceof AxiosError) {
                const backendMessage = e.response?.data?.message;
                setError(backendMessage || "Error al procesar la compra. Intenta nuevamente.");
            } else {
                setError("Ocurrió un error inesperado. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Efecto para manejar el escape y el scroll del body
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleClose]); // handleClose ahora es una dependencia estable

    if (!isOpen) return null;

    const total = ticketPrice * quantity;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Compra de Entradas</h2>
                            <p className="text-gray-600 text-sm mt-1">{eventTitle}</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {step === 'form' && (
                        <>
                            {/* Formulario */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User size={16} className="inline mr-1" />
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            value={buyerName}
                                            onChange={(e) => handleInputChange('buyerName', e.target.value)}
                                        />
                                        {fieldErrors.buyerName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={12} className="mr-1" />
                                                {fieldErrors.buyerName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User size={16} className="inline mr-1" />
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu apellido"
                                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerLastName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            value={buyerLastName}
                                            onChange={(e) => handleInputChange('buyerLastName', e.target.value)}
                                        />
                                        {fieldErrors.buyerLastName && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={12} className="mr-1" />
                                                {fieldErrors.buyerLastName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16} className="inline mr-1" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerEmail ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        value={buyerEmail}
                                        onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                                    />
                                    {fieldErrors.buyerEmail && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle size={12} className="mr-1" />
                                            {fieldErrors.buyerEmail}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone size={16} className="inline mr-1" />
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="11 1234 5678"
                                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerPhone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            value={buyerPhone}
                                            onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                                        />
                                        {fieldErrors.buyerPhone && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={12} className="mr-1" />
                                                {fieldErrors.buyerPhone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard size={16} className="inline mr-1" />
                                            DNI *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="12345678"
                                            className={`w-full border-2 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${fieldErrors.buyerDni ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            value={buyerDni}
                                            onChange={(e) => handleInputChange('buyerDni', e.target.value)}
                                        />
                                        {fieldErrors.buyerDni && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={12} className="mr-1" />
                                                {fieldErrors.buyerDni}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cantidad y precio */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="font-medium text-gray-700 flex items-center">
                                        <ShoppingCart size={16} className="mr-2" />
                                        Cantidad de entradas:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Precio por entrada:</span>
                                    <span>${ticketPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800 mt-2 pt-2 border-t">
                                    <span>Total:</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <p className="text-red-600 text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        'Continuar al pago'
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'payment' && (
                        <>
                            {/* Resumen de compra */}
                            {orderData && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center mb-3">
                                        <CheckCircle size={20} className="text-green-600 mr-2" />
                                        <h3 className="font-semibold text-green-800">Orden creada exitosamente</h3>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Comprador:</span>
                                            <span className="font-medium">{buyerName} {buyerLastName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{buyerEmail}</span>
                                        </div>
                                        {buyerPhone && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Teléfono:</span>
                                                <span className="font-medium">{buyerPhone}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">DNI:</span>
                                            <span className="font-medium">{buyerDni}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cantidad:</span>
                                            <span className="font-medium">{quantity} entrada(s)</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-green-200">
                                            <span className="text-gray-600">Total:</span>
                                            <span className="font-bold text-lg">${orderData.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold mb-2">Completa tu pago</h3>
                                <p className="text-gray-600 text-sm">
                                    Serás redirigido a la plataforma de pagos para completar tu compra de forma segura.
                                </p>
                            </div>

                            {/* Botones de pago */}
                            <div className="space-y-3">
                                <a
                                    href={paymentUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                                >
                                    Pagar Ahora
                                </a>
                                <button
                                    onClick={handleClose}
                                    className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
