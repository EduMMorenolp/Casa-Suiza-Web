import { Request, Response } from "express";
import * as eventService from "../services/eventService";

export async function createEventHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { title, description, location, date, price, imageUrl } = req.body;

    if (!title || !date || price === undefined) {
      res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newEvent = await eventService.createEvent({
      title,
      description,
      location,
      date: new Date(date),
      price,
      imageUrl,
    });

    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error creando evento" });
  }
}

export async function getEventByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);

    if (!event) {
      res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(event);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error obteniendo evento" });
  }
}

export async function updateEventHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedEvent = await eventService.updateEvent(id, data);

    if (!updatedEvent) {
      res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(updatedEvent);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error actualizando evento" });
  }
}

export async function deleteEventHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const deletedEvent = await eventService.deleteEvent(id);

    if (!deletedEvent) {
      res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json({ message: "Evento eliminado correctamente" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error eliminando evento" });
  }
}

export async function listEventsHandler(req: Request, res: Response) {
  try {
    // Filtros opcionales: title (nombre), fromDate, toDate (rango)
    const { title, fromDate, toDate } = req.query;

    const events = await eventService.listEvents({
      title: typeof title === "string" ? title : undefined,
      fromDate: fromDate ? new Date(String(fromDate)) : undefined,
      toDate: toDate ? new Date(String(toDate)) : undefined,
    });

    res.json(events);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error listando eventos" });
  }
}
