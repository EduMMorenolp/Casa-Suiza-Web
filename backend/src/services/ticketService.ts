import prisma from "../config/prismaClient";
import { TicketStatus, Prisma } from "@prisma/client"; // Importa 'Prisma' para los tipos generados
import { CustomError } from "../utils/CustomError";

// Define un tipo para un Ticket que siempre incluye su Evento asociado
// Esto le dice a TypeScript que 'event' estará presente en el objeto Ticket
export type TicketWithEvent = Prisma.TicketGetPayload<{
  include: { event: true };
}>;

export interface TicketData {
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string | null;
  buyerDni: string;
}

/**
 * Crea un nuevo ticket en estado PENDING.
 * @param data Los datos del comprador y el evento.
 * @returns El ticket creado.
 * @throws CustomError si el evento no es encontrado.
 */
export async function createTicket(data: TicketData) {
  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) {
    throw new CustomError("Evento no encontrado.", 404);
  }

  if (event.soldOut) {
    throw new CustomError("Este evento está agotado.", 400);
  }

  // Verificar capacidad si está definida
  if (event.capacity) {
    const currentTicketsCount = await prisma.ticket.count({
      where: { 
        eventId: data.eventId,
        status: { in: [TicketStatus.PENDING, TicketStatus.PAID] }
      }
    });
    
    if (currentTicketsCount >= event.capacity) {
      // Marcar evento como agotado
      await prisma.event.update({
        where: { id: data.eventId },
        data: { soldOut: true }
      });
      throw new CustomError("Este evento ha alcanzado su capacidad máxima.", 400);
    }
  }

  const ticket = await prisma.ticket.create({
    data: {
      eventId: data.eventId,
      buyerName: data.buyerName,
      buyerLastName: data.buyerLastName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      buyerDni: data.buyerDni,
      status: TicketStatus.PENDING,
    },
  });
  return ticket;
}

/**
 * Obtiene todos los tickets.
 * @returns Una lista de tickets.
 */
export async function findAllTickets() {
  return prisma.ticket.findMany({
    include: {
      event: true, // Aseguramos que se incluya el evento también aquí
    },
  });
}

/**
 * Obtiene un ticket por su ID.
 * @param id El ID del ticket.
 * @returns El ticket encontrado con su evento asociado, o null si no existe.
 */
export async function findTicketById(
  id: number
): Promise<TicketWithEvent | null> {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      event: true, // Esto asegura que 'event' siempre se cargue
    },
  });
}

/**
 * Actualiza el estado de un ticket.
 * @param ticketId El ID del ticket a actualizar.
 * @param status El nuevo estado del ticket.
 * @returns El ticket actualizado.
 * @throws CustomError si el ticket no es encontrado.
 */
export async function updateTicketStatus(
  ticketId: number,
  status: TicketStatus
) {
  try {
    return await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError(
        "Ticket no encontrado para actualizar su estado.",
        404
      );
    }
    throw error;
  }
}

/**
 * Actualiza los datos de un ticket existente.
 * @param id El ID del ticket a actualizar.
 * @param data Los datos a actualizar del ticket.
 * @returns El ticket actualizado.
 * @throws CustomError si el ticket no es encontrado.
 */
export async function updateTicket(id: number, data: Partial<TicketData>) {
  try {
    return await prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        // Si se actualiza el eventId, verificar que el nuevo evento exista
        ...(data.eventId && { eventId: data.eventId }),
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Ticket no encontrado para actualizar.", 404);
    }
    throw error;
  }
}

/**
 * Elimina un ticket por su ID.
 * @param id El ID del ticket a eliminar.
 * @throws CustomError si el ticket no es encontrado.
 */
export async function deleteTicket(id: number) {
  try {
    await prisma.ticket.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Ticket no encontrado para eliminar.", 404);
    }
    throw error;
  }
}
