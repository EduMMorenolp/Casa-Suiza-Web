import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";
import { Prisma } from "@prisma/client";

interface CreateEventInput {
  title: string;
  description?: string | null;
  location?: string | null;
  date: Date;
  capacity?: number | null;
  promo?: boolean | null;
  soldOut?: boolean | null;
  price: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  organizerId?: string | null;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  location?: string | null;
  date?: Date;
  capacity?: number | null;
  promo?: boolean | null;
  soldOut?: boolean | null;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  organizerId?: string | null;
  isActive?: boolean;
}

export interface ListEventsFilters {
  title?: string;
  fromDate?: Date;
  toDate?: Date;
  categoryId?: string;
  organizerId?: string;
  promo?: boolean;
  soldOut?: boolean;
  includeInactive?: boolean;
}

/**
 * Crea un nuevo evento.
 * @param data Los datos para crear el evento.
 * @returns El evento creado.
 * @throws CustomError si hay un conflicto (ej. categoría/organizador no encontrado) o error interno.
 */
export async function createEvent(data: CreateEventInput) {
  try {
    const validationPromises = [];

    if (data.categoryId) {
      validationPromises.push(
        prisma.category
          .findUnique({ where: { id: data.categoryId } })
          .then((category) => ({ type: "category", exists: !!category }))
      );
    }

    if (data.organizerId) {
      validationPromises.push(
        prisma.user
          .findUnique({ where: { id: data.organizerId } })
          .then((organizer) => ({ type: "organizer", exists: !!organizer }))
      );
    }

    if (validationPromises.length > 0) {
      const results = await Promise.all(validationPromises);
      for (const result of results) {
        if (!result.exists) {
          const message =
            result.type === "category"
              ? "Categoría no encontrada."
              : "Organizador no encontrado.";
          throw new CustomError(message, 404);
        }
      }
    }

    const finalData = { ...data };
    if (finalData.capacity === 0) {
      finalData.soldOut = true;
    }

    return await prisma.event.create({ data: finalData });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error("Error inesperado al crear evento:", error);
    throw new CustomError("Error interno al crear el evento.", 500);
  }
}

/**
 * Obtiene un evento por su ID.
 * Incluye relaciones con Category, User (organizer) y conteo de tickets.
 * Por defecto, solo retorna eventos activos (isActive: true).
 * @param id El ID del evento.
 * @returns El evento encontrado o null si no existe o está inactivo.
 */
export async function getEventById(id: string) {
  return await prisma.event.findUnique({
    where: { id, isActive: true },
    include: {
      category: true,
      organizer: true,
      _count: {
        select: { tickets: true },
      },
    },
  });
}

/**
 * Actualiza un evento existente.
 * @param id El ID del evento a actualizar.
 * @param data Los datos a actualizar.
 * @returns El evento actualizado.
 * @throws CustomError si el evento no es encontrado, hay un conflicto o error interno.
 */
export async function updateEvent(id: string, data: UpdateEventInput) {
  try {
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new CustomError("Categoría no encontrada.", 404);
      }
    }
    if (data.organizerId) {
      const organizer = await prisma.user.findUnique({
        where: { id: data.organizerId },
      });
      if (!organizer) {
        throw new CustomError("Organizador no encontrado.", 404);
      }
    }

    if (data.capacity === 0) {
      data.soldOut = true;
    } else if (data.capacity !== undefined && data.capacity !== null) {
      const currentTicketsCount = await prisma.ticket.count({
        where: { eventId: id },
      });
      if (currentTicketsCount < data.capacity) {
        data.soldOut = false;
      }
    }

    return await prisma.event.update({
      where: { id },
      data,
    });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error;
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Evento no encontrado para actualizar.", 404);
    }
    console.error("Error inesperado al actualizar evento:", error);
    throw new CustomError("Error interno al actualizar el evento.", 500);
  }
}

/**
 * "Elimina" (soft delete) un evento marcándolo como inactivo.
 * @param id El ID del evento a "eliminar".
 * @returns El evento actualizado (marcado como inactivo).
 * @throws CustomError si el evento no es encontrado o error interno.
 */
export async function deleteEvent(id: string) {
  try {
    return await prisma.event.update({
      where: { id },
      data: { isActive: false },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Evento no encontrado para eliminar.", 404);
    }
    console.error("Error inesperado al eliminar evento:", error);
    throw new CustomError("Error interno al eliminar el evento.", 500);
  }
}

/**
 * Lista eventos con filtros opcionales y el conteo de tickets vendidos.
 * Por defecto, solo lista eventos activos (isActive: true).
 * @param filters Filtros para la búsqueda de eventos. `includeInactive` para ver eventos "eliminados".
 * @returns Una lista de eventos que coinciden con los filtros, incluyendo `sold` (tickets vendidos).
 */
export async function listEvents(filters: ListEventsFilters) {
  const whereClause: Prisma.EventWhereInput = {};

  if (filters.title) {
    whereClause.title = {
      contains: filters.title,
    };
  }

  if (filters.fromDate || filters.toDate) {
    whereClause.date = {};
    if (filters.fromDate) {
      whereClause.date.gte = filters.fromDate;
    }
    if (filters.toDate) {
      whereClause.date.lte = filters.toDate;
    }
  }

  if (filters.categoryId) {
    whereClause.categoryId = filters.categoryId;
  }

  if (filters.organizerId) {
    whereClause.organizerId = filters.organizerId;
  }

  if (filters.promo !== undefined) {
    whereClause.promo = filters.promo;
  }

  if (filters.soldOut !== undefined) {
    whereClause.soldOut = filters.soldOut;
  }

  whereClause.isActive = true;

  if (filters.includeInactive === true) {
    delete whereClause.isActive;
  }

  const eventsWithTicketCount = await prisma.event.findMany({
    where: whereClause,
    include: {
      category: true,
      organizer: true,
      _count: {
        select: { tickets: true },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const events = eventsWithTicketCount.map((event) => {
    const { _count, ...rest } = event;
    return {
      ...rest,
      sold: _count.tickets,
      isActive: event.isActive,
    };
  });
  return events;
}

export async function getDashboardStats() {
  try {
    const activeEvents = await prisma.event.count({
      where: { isActive: true }
    });

    const totalTickets = await prisma.ticket.count({
      where: { status: 'PAID' }
    });

    const totalUsers = await prisma.user.count({
      where: { isDeleted: false }
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { totalPrice: true }
    });

    return {
      activeEvents,
      totalTickets,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw new CustomError('Error al obtener estadísticas del dashboard', 500);
  }
}
