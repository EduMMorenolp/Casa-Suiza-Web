interface MercadoPagoPaymentProProps {
    preferenceId: string;
}

export function MercadoPagoPaymentPro({ preferenceId }: MercadoPagoPaymentProProps) {
    const handleRedirect = () => {
        const url = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${preferenceId}`;
        window.location.href = url;
    };

    return (
        <div className="w-full text-center py-8">
            <button
                onClick={handleRedirect}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Pagar con Mercado Pago
            </button>
        </div>
    );
}
