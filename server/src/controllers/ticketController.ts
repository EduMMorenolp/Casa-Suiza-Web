import { Request, Response } from "express";
import * as ticketService from "../services/ticketService";

export async function createTicketHandler(req: Request, res: Response): Promise<void> {
  try {
    const { eventId, buyerName, buyerLastName, buyerEmail, buyerPhone, buyerDni } =
      req.body;
    if (!eventId || !buyerName || !buyerLastName || !buyerEmail || !buyerDni) {
      res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const ticket = await ticketService.createTicket({
      eventId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerDni
    });

    res.status(201).json(ticket);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error al crear el ticket" });
  }
}
