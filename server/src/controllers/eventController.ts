import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/eventService";
import { CustomError } from "../utils/CustomError";

// Crear un nuevo evento
export async function createEventHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      title,
      description,
      location,
      date,
      capacity,
      promo,
      soldOut,
      price,
      imageUrl,
      categoryId,
      organizerId,
    } = req.body;

    // Validaciones básicas
    if (!title || !date || price === undefined || price === null) {
      throw new CustomError(
        "Faltan datos obligatorios para crear el evento (título, fecha, precio).",
        400
      );
    }
    if (typeof title !== "string" || title.trim() === "") {
      throw new CustomError("El título del evento es inválido.", 400);
    }
    if (isNaN(new Date(date).getTime())) {
      throw new CustomError("Formato de fecha inválido.", 400);
    }
    if (typeof price !== "number" || price < 0) {
      throw new CustomError("El precio debe ser un número positivo.", 400);
    }
    if (
      capacity !== undefined &&
      capacity !== null &&
      (typeof capacity !== "number" || capacity < 0)
    ) {
      throw new CustomError(
        "La capacidad debe ser un número positivo o nulo.",
        400
      );
    }
    if (promo !== undefined && typeof promo !== "boolean") {
      throw new CustomError("El campo 'promo' debe ser un booleano.", 400);
    }
    if (soldOut !== undefined && typeof soldOut !== "boolean") {
      throw new CustomError("El campo 'soldOut' debe ser un booleano.", 400);
    }
    if (
      categoryId !== undefined &&
      categoryId !== null &&
      typeof categoryId !== "string"
    ) {
      throw new CustomError("El ID de categoría es inválido.", 400);
    }
    if (
      organizerId !== undefined &&
      organizerId !== null &&
      typeof organizerId !== "string"
    ) {
      throw new CustomError("El ID de organizador es inválido.", 400);
    }

    const newEvent = await eventService.createEvent({
      title,
      description,
      location,
      date: new Date(date),
      capacity,
      promo,
      soldOut,
      price,
      imageUrl,
      categoryId,
      organizerId,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

// Obtener un evento por ID
export async function getEventByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);

    if (!event) {
      throw new CustomError("Evento no encontrado.", 404);
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
}

// Actualizar un evento existente
export async function updateEventHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      date,
      capacity,
      promo,
      soldOut,
      price,
      imageUrl,
      categoryId,
      organizerId,
    } = req.body;

    // Construir objeto de datos a actualizar, solo con campos presentes
    const updateData: eventService.UpdateEventInput = {};
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "")
        throw new CustomError("El título del evento es inválido.", 400);
      updateData.title = title;
    }
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (date !== undefined) {
      if (isNaN(new Date(date).getTime()))
        throw new CustomError("Formato de fecha inválido.", 400);
      updateData.date = new Date(date);
    }
    if (capacity !== undefined) {
      if (capacity !== null && (typeof capacity !== "number" || capacity < 0))
        throw new CustomError(
          "La capacidad debe ser un número positivo o nulo.",
          400
        );
      updateData.capacity = capacity;
    }
    if (promo !== undefined) {
      if (typeof promo !== "boolean")
        throw new CustomError("El campo 'promo' debe ser un booleano.", 400);
      updateData.promo = promo;
    }
    if (soldOut !== undefined) {
      if (typeof soldOut !== "boolean")
        throw new CustomError("El campo 'soldOut' debe ser un booleano.", 400);
      updateData.soldOut = soldOut;
    }
    if (price !== undefined) {
      if (typeof price !== "number" || price < 0)
        throw new CustomError("El precio debe ser un número positivo.", 400);
      updateData.price = price;
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) {
      if (categoryId !== null && typeof categoryId !== "string")
        throw new CustomError("El ID de categoría es inválido.", 400);
      updateData.categoryId = categoryId;
    }
    if (organizerId !== undefined) {
      if (organizerId !== null && typeof organizerId !== "string")
        throw new CustomError("El ID de organizador es inválido.", 400);
      updateData.organizerId = organizerId;
    }

    // Si no se proporcionó ningún campo para actualizar
    if (Object.keys(updateData).length === 0) {
      throw new CustomError(
        "Se requiere al menos un campo para actualizar el evento.",
        400
      );
    }

    const updatedEvent = await eventService.updateEvent(id, updateData);

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
}

// Eliminar un evento
export async function deleteEventHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    await eventService.deleteEvent(id); // El servicio ya lanza CustomError si no lo encuentra

    res.json({ message: "Evento eliminado correctamente." });
  } catch (error) {
    next(error);
  }
}

// Listar eventos con filtros opcionales
export async function listEventsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, fromDate, toDate, categoryId, organizerId, promo, soldOut } =
      req.query;

    const filters: eventService.ListEventsFilters = {
      title: typeof title === "string" ? title : undefined,
      fromDate: fromDate ? new Date(String(fromDate)) : undefined,
      toDate: toDate ? new Date(String(toDate)) : undefined,
      categoryId: typeof categoryId === "string" ? categoryId : undefined,
      organizerId: typeof organizerId === "string" ? organizerId : undefined,
      promo:
        promo !== undefined
          ? String(promo).toLowerCase() === "true"
          : undefined,
      soldOut:
        soldOut !== undefined
          ? String(soldOut).toLowerCase() === "true"
          : undefined,
    };

    const events = await eventService.listEvents(filters);

    res.json(events);
  } catch (error) {
    next(error);
  }
}
