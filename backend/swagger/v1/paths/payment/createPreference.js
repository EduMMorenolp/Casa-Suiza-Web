import TicketInput from "../../components/schemas/ticket/TicketInput.js";
import PreferenceResponse from "../../components/schemas/payment/PreferenceResponse.js";

const createPreference = {
    post: {
        tags: ["Pagos"],
        summary: "Crear preferencia de pago",
        description:
            "Genera una preferencia de pago en MercadoPago para un ticket.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: TicketInput,
                },
            },
        },
        responses: {
            200: {
                description: "Preferencia creada con éxito",
                content: {
                    "application/json": {
                        schema: PreferenceResponse,
                    },
                },
            },
            500: {
                description: "Error al crear la preferencia",
            },
        },
    },
};

export default createPreference;
