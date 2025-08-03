import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticketService";
import { CustomError } from "../utils/CustomError";
import { TicketStatus } from "@prisma/client";

// Crear un nuevo ticket
export async function createTicketHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      eventId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerDni,
    } = req.body;
    if (!eventId || !buyerName || !buyerLastName || !buyerEmail || !buyerDni) {
      throw new CustomError(
        "Faltan datos requeridos para crear el ticket.",
        400
      );
    }
    
    const ticket = await ticketService.createTicket({
      eventId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerDni,
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

// Obtener todos los tickets
export async function getAllTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tickets = await ticketService.findAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}

// Obtener un ticket por ID
export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const ticket = await ticketService.findTicketById(Number(id));
    if (!ticket) {
      throw new CustomError("Ticket no encontrado.", 404);
    }
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

// Actualizar un ticket existente
export async function updateTicketController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const {
      eventId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerDni,
      status,
    } = req.body;

    // Validar que al menos un campo para actualizar esté presente
    if (
      !eventId &&
      !buyerName &&
      !buyerLastName &&
      !buyerEmail &&
      !buyerPhone &&
      !buyerDni &&
      !status
    ) {
      throw new CustomError(
        "Se requiere al menos un campo para actualizar el ticket.",
        400
      );
    }

    // Construir el objeto de datos a actualizar
    const updateData: Partial<
      ticketService.TicketData & { status: TicketStatus }
    > = {};
    if (eventId) updateData.eventId = eventId;
    if (buyerName) updateData.buyerName = buyerName;
    if (buyerLastName) updateData.buyerLastName = buyerLastName;
    if (buyerEmail) updateData.buyerEmail = buyerEmail;
    if (buyerPhone !== undefined) updateData.buyerPhone = buyerPhone; // Permite actualizar a null
    if (buyerDni) updateData.buyerDni = buyerDni;
    if (status) updateData.status = status; // Si el estado se actualiza directamente

    const updatedTicket = await ticketService.updateTicket(
      Number(id),
      updateData
    );
    res.status(200).json(updatedTicket);
  } catch (error) {
    next(error);
  }
}

// Eliminar un ticket
export async function deleteTicketController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    await ticketService.deleteTicket(Number(id));
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
}
