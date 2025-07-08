import Event from "../../components/schemas/event/Event.js";

const updateEvent = {
    put: {
        tags: ["Event"],
        summary: "Actualizar un evento por ID",
        description: "Actualiza los datos de un evento existente.",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "ID del evento a actualizar",
                schema: { type: "string", format: "uuid" },
            },
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: { type: "string" },
                            description: { type: "string" },
                            location: { type: "string" },
                            date: { type: "string", format: "date-time" },
                            price: { type: "number" },
                            imageUrl: { type: "string" },
                        },
                        additionalProperties: false,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Evento actualizado exitosamente",
                content: {
                    "application/json": {
                        schema: Event,
                    },
                },
            },
            400: {
                description: "Datos inválidos",
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

export default updateEvent;
