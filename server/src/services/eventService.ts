import prisma from "../config/prismaClient";

interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  date: Date;
  price: number;
  soldOut?: Boolean;
  promo?: Boolean;
  imageUrl?: string;
}

interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  date?: Date;
  price?: number;
  imageUrl?: string;
}

interface ListEventsFilters {
  title?: string;
  fromDate?: Date;
  toDate?: Date;
}

export async function createEvent(data: CreateEventInput) {
  return await prisma.event.create({ data });
}

export async function getEventById(id: string) {
  return await prisma.event.findUnique({ where: { id } });
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  return await prisma.event.update({
    where: { id },
    data,
  });
}

export async function deleteEvent(id: string) {
  return await prisma.event.delete({ where: { id } });
}

export async function listEvents(filters: ListEventsFilters) {
  const whereClause: any = {};

  if (filters.title) {
    whereClause.title = {
      contains: filters.title,
      mode: "insensitive",
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

  return await prisma.event.findMany({ where: whereClause });
}
