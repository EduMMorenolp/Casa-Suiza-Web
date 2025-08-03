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

    res.status(201).json({ id: ticket.id, status: "created" });
  } catch (error) {
    console.error("Error creating ticket:", error);
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
    const tickets = await ticketService.getAllTicketsWithEvents();
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

function validateUpdateFields(fields: any): void {
  const hasFields = Object.values(fields).some((field) => field !== undefined);
  if (!hasFields) {
    throw new CustomError(
      "Se requiere al menos un campo para actualizar el ticket.",
      400
    );
  }
}

function buildUpdateData(
  fields: any
): Partial<ticketService.TicketData & { status: TicketStatus }> {
  const updateData: any = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) updateData[key] = value;
  });
  return updateData;
}

// Actualizar un ticket existente
export async function updateTicketController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const fields = req.body;

    validateUpdateFields(fields);
    const updateData = buildUpdateData(fields);

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
