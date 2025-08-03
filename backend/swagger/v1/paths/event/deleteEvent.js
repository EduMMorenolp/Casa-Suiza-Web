const deleteEvent = {
    delete: {
        tags: ["Event"],
        summary: "Eliminar un evento por ID",
        description: "Elimina un evento dado su ID.",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                description: "ID del evento a eliminar",
                schema: { type: "string", format: "uuid" },
            },
        ],
        responses: {
            204: {
                description: "Evento eliminado exitosamente (sin contenido)",
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

export default deleteEvent;
  