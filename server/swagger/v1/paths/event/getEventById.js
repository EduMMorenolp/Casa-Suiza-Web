import Event from "../../components/schemas/event/Event.js";

const getEventById = {
    get: {
        tags: ["Event"],
        summary: "Obtener evento por ID",
        description: "Retorna los datos de un evento dado su ID.",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "ID del evento",
                schema: { type: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "Evento encontrado",
                content: {
                    "application/json": {
                        schema: Event,
                    },
                },
            },
            404: {
                description: "Evento no encontrado",
            },
            500: {
                description: "Error interno del servidor",
            },
        },
    },
};

export default getEventById;
