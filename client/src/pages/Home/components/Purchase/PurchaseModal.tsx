import { useState, useEffect, useCallback } from "react";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { AxiosError } from "axios";

import { createTicket } from "../../../../api/ticket";
import { createOrder } from "../../../../api/order";
import type { OrderData } from "../../../../api/order";
import { createPaymentPreference } from "../../../../api/payments";

import { usePurchaseForm } from "./usePurchaseForm";
import { PurchaseForm } from "./PurchaseForm";
import { PaymentSummary } from "./PaymentSummary";
import { MercadoPagoPaymentBrick } from "./MercadoPagoPaymentBrick";

interface PurchaseModalProps {
    isOpen: boolean;
    eventId: string;
    eventTitle: string;
    ticketPrice: number;
    onClose: () => void;
    userId?: string;
}

// **IMPORTANTE:** Public Key de Mercado Pago
const MERCADO_PAGO_PUBLIC_KEY = "TEST-fa40a928-2f57-48c0-b4d4-d0c062a3e729";

export default function PurchaseModal({
    isOpen,
    eventId,
    eventTitle,
    ticketPrice,
    onClose,
    userId,
}: PurchaseModalProps) {
    const {
        buyerName, buyerLastName, buyerEmail, buyerPhone, buyerDni, quantity,
        setQuantity, fieldErrors, handleInputChange, validateAllFields, resetForm,
    } = usePurchaseForm();

    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [loading, setLoading] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderData | null>(null);

    const handleClose = useCallback(() => {
        resetForm();
        setStep('form');
        setError(null);
        setPreferenceId(null);
        setOrderData(null);
        onClose();
    }, [resetForm, onClose]);

    const handleFormSubmit = async () => {
        if (!validateAllFields() || quantity < 1) {
            setError("Por favor corrige los errores y asegúrate de seleccionar al menos una entrada.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const ticketIds: number[] = [];
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

            const order = await createOrder({
                userId: userId || null,
                ticketIds: ticketIds,
            });
            setOrderData(order);

            const { preferenceId: newPreferenceId } = await createPaymentPreference({
                orderId: order.id,
                amount: (ticketPrice * quantity) + (ticketPrice * quantity * 0.1),
                buyerName: buyerName,
                buyerLastName: buyerLastName,
                buyerEmail: buyerEmail,
                buyerPhone: buyerPhone || undefined,
                buyerDni: buyerDni,
            });

            setPreferenceId(newPreferenceId);
            setStep('payment');
        } catch (e: unknown) {
            console.error("Error en el proceso de compra (creación de tickets/orden/preferencia):", e);
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

    const handleBrickReady = () => {
        console.log("Payment Brick listo para interactuar.");
    };

    const handleBrickSubmit = async (formData: unknown) => {
        setLoading(true);
        setError(null);
        console.log("Datos de pago recibidos del Brick:", formData);

        try {
            setStep('success');
        } catch (e: unknown) {
            console.error("Error al procesar el pago con el Brick:", e);
            if (e instanceof AxiosError) {
                const backendMessage = e.response?.data?.message;
                setError(backendMessage || "Error al procesar el pago. Intenta nuevamente.");
            } else {
                setError("Ocurrió un error inesperado al procesar el pago. Intenta nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBrickError = (error: unknown) => {
        console.error("Error en el Payment Brick:", error);
        setError("Hubo un error con el formulario de pago. Por favor, inténtalo de nuevo.");
    };

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
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    const totalAmount = (ticketPrice * quantity) + (ticketPrice * quantity * 0.1);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Compra de Entradas</h2>
                            <p className="text-gray-600 text-sm mt-1">de {eventTitle}</p>
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
                            <PurchaseForm
                                buyerName={buyerName}
                                buyerLastName={buyerLastName}
                                buyerEmail={buyerEmail}
                                buyerPhone={buyerPhone}
                                buyerDni={buyerDni}
                                quantity={quantity}
                                ticketPrice={ticketPrice}
                                fieldErrors={fieldErrors}
                                handleInputChange={handleInputChange}
                                setQuantity={setQuantity}
                                error={error}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleFormSubmit} // Cambiado a handleFormSubmit
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
                            {orderData && (
                                <PaymentSummary // Puedes reutilizar este componente o crear uno más simple para el resumen
                                    orderData={orderData}
                                    buyerName={buyerName}
                                    buyerLastName={buyerLastName}
                                    buyerEmail={buyerEmail}
                                    buyerPhone={buyerPhone}
                                    buyerDni={buyerDni}
                                    quantity={quantity}
                                    paymentUrl={null} // Ya no usamos URL de pago aquí
                                    onClose={() => setStep('form')} // Opción para volver al formulario
                                />
                            )}
                            <div className="text-center mb-6">
                                <h3 className="lg:text-lg font-semibold mb-2">Completa tu pago</h3>
                                <p className="text-gray-600 text-sm">
                                    Ingresa los datos de tu tarjeta o elige otro medio de pago.
                                </p>
                            </div>

                            {error && ( // Mostrar errores específicos del Brick aquí
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <p className="text-red-600 text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error}
                                    </p>
                                </div>
                            )}

                            {preferenceId && (
                                <MercadoPagoPaymentBrick
                                    publicKey={MERCADO_PAGO_PUBLIC_KEY}
                                    preferenceId={preferenceId}
                                    onReady={handleBrickReady}
                                    onSubmit={handleBrickSubmit}
                                    onError={handleBrickError}
                                    amount={totalAmount}
                                />
                            )}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                >
                                    Cancelar Compra
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-10">
                            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h3>
                            <p className="text-gray-600 mb-6">Tus entradas han sido compradas. Recibirás un correo con los detalles.</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}