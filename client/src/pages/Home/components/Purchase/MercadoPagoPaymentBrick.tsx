// MercadoPagoPaymentBrick.tsx

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

export function MercadoPagoPaymentBrick({
    publicKey,
    preferenceId,
    onReady,
    onSubmit,
    onError,
    amount,
}: MercadoPagoPaymentBrickProps) {
    const brickContainer = useRef<HTMLDivElement>(null);
    const [brickRendered, setBrickRendered] = useState(false);

    useEffect(() => {
        if (!publicKey || !preferenceId) {
            console.error("Mercado Pago Public Key o Preference ID no proporcionados.");
            return;
        }

        const mercadoPagoWindow = window as MercadoPagoWindow;
        let intervalId: number | null = null;
        let isInitialized = false;

        const tryInitializeAndRenderBrick = () => {
            if (mercadoPagoWindow.MercadoPago && mercadoPagoWindow.MercadoPago.bricks) {
                console.log("Mercado Pago SDK global detectado. Iniciando Brick...");

                if (!isInitialized) {
                    try {
                        initMercadoPago(publicKey, { locale: 'es-AR' });
                        isInitialized = true;
                        console.log("Mercado Pago SDK inicializado con Public Key.");
                    } catch (error) {
                        console.error("Error al inicializar Mercado Pago SDK (initMercadoPago):", error);
                        onError(error);
                        if (intervalId) clearInterval(intervalId);
                        return;
                    }
                }

                if (brickRendered) {
                    if (intervalId) clearInterval(intervalId);
                    return;
                }

                if (brickContainer.current) {
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
                                    setBrickRendered(true);
                                    if (intervalId) clearInterval(intervalId);
                                },
                                onSubmit: async (formData: unknown) => {
                                    console.log("Datos de pago enviados por el Brick:", formData);
                                    return onSubmit(formData);
                                },
                                onError: (error: unknown) => {
                                    console.error("Error en Payment Brick:", error);
                                    onError(error);
                                    if (intervalId) clearInterval(intervalId);
                                },
                            },
                        });

                        paymentBrick.render();

                    } catch (error) {
                        console.error("Error al crear/renderizar Payment Brick:", error);
                        onError(error);
                        if (intervalId) clearInterval(intervalId);
                    }
                } else {
                    console.warn("Contenedor del Brick no disponible aún. Reintentando...");
                }
            } else {
                console.warn("Mercado Pago SDK no disponible aún. Esperando...");
            }
        };

        intervalId = setInterval(tryInitializeAndRenderBrick, 2000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };

    }, [publicKey, preferenceId, onReady, onSubmit, onError, amount, brickRendered]);

    return (
        <div id="paymentBrickContainer" ref={brickContainer} className="w-full">
            {!brickRendered && <p>Cargando módulo de pago...</p>}
        </div>
    );
}