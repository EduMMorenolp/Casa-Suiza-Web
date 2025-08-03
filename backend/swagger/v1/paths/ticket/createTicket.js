import TicketInput from "../../components/schemas/ticket/TicketInput.js";

const createTicket = {
    post: {
        tags: ["Tickets"],
        summary: "Crear un ticket para un evento",
        description:
            "Registra un nuevo ticket con los datos del comprador para un evento.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: TicketInput,
                },
            },
        },
        responses: {
            201: {
                description: "Ticket creado con éxito",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                id: { type: "string", example: "ticket_12345" },
                                buyerName: { type: "string", example: "Juan" },
                                buyerEmail: { type: "string", example: "juan@email.com" },
                            },
                        },
                    },
                },
            },
            400: {
                description: "Datos faltantes o inválidos",
            },
            500: {
                description: "Error interno del servidor",
            },
        },
    },
};

export default createTicket;
