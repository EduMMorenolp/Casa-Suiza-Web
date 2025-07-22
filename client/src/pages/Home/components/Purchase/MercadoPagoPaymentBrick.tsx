import { useEffect, useRef, useState } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';

interface MercadoPagoPaymentBrickProps {
    publicKey: string;
    preferenceId: string;
    onReady: () => void;
    onSubmit: (formData: unknown) => Promise<void>;
    onError: (error: unknown) => void;
    amount: number;
}

interface MercadoPagoWindow extends Window {
    MercadoPago?: {
        bricks?: () => {
            create: (
                type: string,
                containerId: string,
                options: unknown
            ) => { render: () => void };
        };
    };
}
// Inicializa el SDK de Mercado Pago solo una vez
const mercadoPagoWindow = window as MercadoPagoWindow;

export function MercadoPagoPaymentBrick({
    publicKey,
    preferenceId,
    onReady,
    onSubmit,
    onError,
    amount,
}: MercadoPagoPaymentBrickProps) {
    const brickContainer = useRef<HTMLDivElement>(null);
    const [sdkReady, setSdkReady] = useState(false); // Nuevo estado para controlar la carga del SDK

    useEffect(() => {
        if (!publicKey || !preferenceId) {
            console.error("Mercado Pago Public Key o Preference ID no proporcionados.");
            return;
        }

        if (!mercadoPagoWindow.MercadoPago || !mercadoPagoWindow.MercadoPago.bricks) {
            console.warn("Mercado Pago SDK no disponible aún. Esperando...");
            // Si el SDK no está listo, podríamos añadir un listener aquí
            // o simplemente confiar en que se cargará por el script en index.html
            // y que el useEffect se re-ejecutará cuando esté.
            return;
        }

        if (!sdkReady) {
            try {
                initMercadoPago(publicKey, { locale: 'es-AR' });
                setSdkReady(true);
            } catch (error) {
                console.error("Error al inicializar Mercado Pago SDK:", error);
                onError(error);
                return;
            }
        }


        const renderBrick = async () => {
            if (brickContainer.current && sdkReady) {
                try {

                    const bricksBuilder = (mercadoPagoWindow.MercadoPago as NonNullable<MercadoPagoWindow['MercadoPago']>).bricks!();
                    const paymentBrick = bricksBuilder.create('payment', 'paymentBrickContainer', {
                        initialization: {
                            preferenceId: preferenceId,
                            amount: amount,
                        },
                        customization: {
                            visual: {
                                hideFormTitle: true,
                                hideResultsTabs: false,
                                showExternalReference: false,
                            },
                            paymentMethods: {
                                creditCard: 'all',
                                debitCard: 'all',
                            },
                        },
                        callbacks: {
                            onReady: () => {
                                onReady();
                                console.log("Payment Brick está listo.");
                            },
                            onSubmit: async (formData: unknown) => {
                                console.log("Datos de pago enviados por el Brick:", formData);
                                return onSubmit(formData);
                            },
                            onError: (error: unknown) => {
                                console.error("Error en Payment Brick:", error);
                                onError(error);
                            },
                        },
                    });

                    paymentBrick.render();
                } catch (error) {
                    console.error("Error al renderizar Payment Brick:", error);
                    onError(error);
                }
            }
        };

        if (sdkReady) {
            renderBrick();
        }

    }, [publicKey, preferenceId, onReady, onSubmit, onError, amount, sdkReady]);

    return (
        <div id="paymentBrickContainer" ref={brickContainer} className="w-full">
            {/* El Payment Brick se renderizará aquí */}
        </div>
    );
}