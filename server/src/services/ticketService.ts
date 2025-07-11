import prisma from "../config/prismaClient";
import { TicketStatus } from "@prisma/client";

interface TicketData {
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerDni: string;
}

export async function createTicket(data: TicketData) {
  // Verificar que el evento exista
  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) {
    throw new Error("Evento no encontrado");
  }

  // Crear ticket con estado 'pending'
  const ticket = await prisma.ticket.create({
    data: {
      eventId: data.eventId,
      buyerName: data.buyerName,
      buyerLastName: data.buyerLastName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      status: TicketStatus.PENDING,
    },
  });

  return ticket;
}

export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus
) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });
}
