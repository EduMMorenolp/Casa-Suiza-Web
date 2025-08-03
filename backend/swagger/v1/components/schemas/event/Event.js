const Event = {
    type: "object",
    properties: {
        id: {
            type: "string",
            format: "uuid",
            description: "Identificador único del evento",
            example: "9be566d2-5ba0-11f0-ac70-902b341927b4",
        },
        title: {
            type: "string",
            description: "Título del evento",
            example: "Fiesta Casa Suiza",
        },
        description: {
            type: "string",
            description: "Descripción del evento",
            example: "Una celebración con música, comida y cultura suiza",
            nullable: true,
        },
        location: {
            type: "string",
            description: "Lugar donde se realiza el evento",
            example: "Casa Suiza, Buenos Aires",
            nullable: true,
        },
        date: {
            type: "string",
            format: "date-time",
            description: "Fecha y hora del evento",
            example: "2025-08-15T21:00:00.000Z",
        },
        price: {
            type: "number",
            format: "float",
            description: "Precio por entrada",
            example: 10000,
        },
        imageUrl: {
            type: "string",
            description: "URL de la imagen del evento",
            example: "https://ejemplo.com/imagen.jpg",
            nullable: true,
        },
        createdAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de creación del evento",
            example: "2025-07-07T23:09:41.000Z",
        },
        updatedAt: {
            type: "string",
            format: "date-time",
            description: "Fecha de última actualización",
            example: "2025-07-07T23:09:41.000Z",
        },
    },
    required: ["id", "title", "date", "price", "createdAt", "updatedAt"],
    additionalProperties: false,
};

export default Event;
  