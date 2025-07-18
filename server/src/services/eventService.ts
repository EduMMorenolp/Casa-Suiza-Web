import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";
import { Prisma } from "@prisma/client"; // Importamos Prisma para tipos de errores

interface CreateEventInput {
  title: string;
  description?: string | null; // Puede ser nulo
  location?: string | null; // Puede ser nulo
  date: Date;
  capacity?: number | null; // Puede ser nulo
  promo?: boolean | null; // Puede ser nulo
  soldOut?: boolean | null; // Puede ser nulo
  price: number;
  imageUrl?: string | null; // Puede ser nulo
  categoryId?: string | null; // Puede ser nulo
  organizerId?: string | null; // Puede ser nulo
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
    // Opcional: Verificar si categoryId y organizerId existen si se proporcionan
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

    return await prisma.event.create({ data });
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error; // Re-lanzar CustomError ya definido
    }
    console.error("Error inesperado al crear evento:", error);
    throw new CustomError("Error interno al crear el evento.", 500);
  }
}

/**
 * Obtiene un evento por su ID.
 * Incluye relaciones con Category y User (organizer).
 * @param id El ID del evento.
 * @returns El evento encontrado o null si no existe.
 */
export async function getEventById(id: string) {
  return await prisma.event.findUnique({
    where: { id, isActive: true },
    include: {
      category: true,
      organizer: true,
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
    // Opcional: Verificar si categoryId y organizerId existen si se proporcionan
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
 * Elimina un evento por su ID.
 * @param id El ID del evento a eliminar.
 * @returns El evento eliminado.
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
 * Lista eventos con filtros opcionales.
 * @param filters Filtros para la búsqueda de eventos.
 * @returns Una lista de eventos que coinciden con los filtros.
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

  if (
    filters.includeInactive === undefined ||
    filters.includeInactive === false
  ) {
    whereClause.isActive = true;
  } else if (filters.includeInactive === true) {
    whereClause.isActive;
  }

  // Realizamos la consulta a la base de datos, incluyendo el conteo de tickets
  const eventsWithTicketCount = await prisma.event.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { tickets: true },
      },
    },
  });

  const events = eventsWithTicketCount.map((event) => {
    const { _count, ...rest } = event;
    return {
      ...rest,
      sold: _count.tickets,
      isActive: rest.isActive !== undefined ? rest.isActive : true,
    };
  });
  return events;
}
