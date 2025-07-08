import Event from "../../components/schemas/event/Event.js";

const getAllEvents = {
    get: {
        tags: ["Event"],
        summary: "Obtener todos los eventos",
        description: "Retorna un listado de todos los eventos disponibles.",
        responses: {
            200: {
                description: "Lista de eventos",
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: Event,
                        },
                    },
                },
            },
            500: {
                description: "Error interno del servidor",
            },
        },
    },
};

export default getAllEvents;
