const PreferenceResponse = {
    type: "object",
    properties: {
        id: {
            type: "string",
            description: "ID de la preferencia generada.",
            example: "MOCK_ID_123456",
        },
        status: {
            type: "string",
            description: "Estado de la preferencia.",
            example: "approved",
        },
        init_point: {
            type: "string",
            description: "URL de redirección para iniciar el pago.",
            example:
                "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_ID_123456",
        },
    },
};

export default PreferenceResponse;
  