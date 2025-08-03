import Event from "../../components/schemas/event/Event.js";

const createEvent = {
    post: {
        tags: ["Event"],
        summary: "Crear un nuevo evento",
        description: "Crea un evento nuevo con los datos proporcionados.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: { type: "string", example: "Fiesta Casa Suiza" },
                            description: { type: "string", example: "Descripción opcional" },
                            location: { type: "string", example: "Casa Suiza, Buenos Aires" },
                            date: { type: "string", format: "date-time", example: "2025-08-15T21:00:00.000Z" },
                            price: { type: "number", example: 10000 },
                            imageUrl: { type: "string", example: "https://ejemplo.com/imagen.jpg" },
                        },
                        required: ["title", "date", "price"],
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Evento creado exitosamente",
                content: {
                    "application/json": {
                        schema: Event,
                    },
                },
            },
            400: {
                description: "Datos inválidos",
            },
            500: {
                description: "Error interno del servidor",
            },
        },
    },
};

export default createEvent;
