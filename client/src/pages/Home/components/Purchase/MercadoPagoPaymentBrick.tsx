import { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface MercadoPagoPaymentBrickProps {
    publicKey: string;
    preferenceId: string;
    onReady: () => void;
    onSubmit: (formData: unknown) => Promise<void>;
    onError: (error: unknown) => void;
    amount: number;
    email: string;
    dni: string;
}

export function MercadoPagoPaymentBrick({
    publicKey,
    preferenceId,
    onReady,
    onSubmit,
    onError,
    amount,
}: MercadoPagoPaymentBrickProps) {

    useEffect(() => {
        if (!publicKey) {
            console.error("Mercado Pago Public Key no proporcionada.");
            return;
        }
        try {
            initMercadoPago(publicKey, { locale: 'es-AR' });
        } catch (error) {
            console.error("Error al inicializar Mercado Pago SDK (initMercadoPago):", error);
            onError(error);
        }
    }, [publicKey, onError]);


    const initialization = {
        amount: amount,
        preferenceId: preferenceId,
    };

    const customization = {
        visual: {
            hideFormTitle: true,
            hideResultsTabs: false,
            showExternalReference: false,
        },
        paymentMethods: {
            creditCard: ['all'],
            debitCard: ['all'],
            mercadoPago: ['all'],
        },
    };

    return (
        <div className="w-full">
            {publicKey && preferenceId ? (
                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                />
            ) : (
                <p>Cargando información de pago...</p>
            )}
        </div>
    );
}