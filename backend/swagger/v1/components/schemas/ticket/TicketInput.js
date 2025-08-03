const TicketInput = {
    type: "object",
    properties: {
        eventId: {
            type: "string",
            description: "ID del evento asociado al ticket.",
            example: "evt_12345",
        },
        buyerName: {
            type: "string",
            description: "Nombre del comprador.",
            example: "Juan",
        },
        buyerLastName: {
            type: "string",
            description: "Apellido del comprador.",
            example: "Pérez",
        },
        buyerEmail: {
            type: "string",
            format: "email",
            description: "Correo del comprador.",
            example: "juan.perez@email.com",
        },
        buyerPhone: {
            type: "string",
            description: "Teléfono del comprador.",
            example: "1123456789",
        },
    },
    required: ["eventId", "buyerName", "buyerLastName", "buyerEmail"],
};

export default TicketInput;
  