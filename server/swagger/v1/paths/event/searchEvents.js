import Event from "../../components/schemas/event/Event.js";

const searchEvents = {
    get: {
        tags: ["Event"],
        summary: "Buscar eventos por título o fecha",
        description: "Permite filtrar eventos por título o fecha usando query params.",
        parameters: [
            {
                name: "title",
                in: "query",
                description: "Título parcial para filtrar eventos",
                required: false,
                schema: { type: "string" },
            },
            {
                name: "date",
                in: "query",
                description: "Fecha exacta para filtrar eventos (YYYY-MM-DD)",
                required: false,
                schema: { type: "string", format: "date" },
            },
        ],
        responses: {
            200: {
                description: "Eventos filtrados",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: Event,
                        },
                    },
                },
            },
            400: {
                description: "Parámetros inválidos",
            },
            500: {
                description: "Error interno del servidor",
            },
        },
    },
};

export default searchEvents;
