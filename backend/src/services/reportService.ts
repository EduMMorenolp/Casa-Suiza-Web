import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

export async function getReportsData(period: string = 'mes') {
  try {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'semana':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'trimestre':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'año':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: 'PAID',
        createdAt: { gte: startDate }
      },
      _sum: { totalPrice: true }
    });

    const totalEvents = await prisma.event.count({
      where: {
        createdAt: { gte: startDate },
        isActive: true
      }
    });

    const totalAttendees = await prisma.ticket.count({
      where: {
        status: 'PAID',
        purchaseAt: { gte: startDate }
      }
    });

    const occupancyRate = await calculateOccupancyRate(startDate);

    return {
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalEvents,
      totalAttendees,
      occupancyRate
    };
  } catch (error) {
    console.error('Error obteniendo datos de reportes:', error);
    throw new CustomError('Error al obtener datos de reportes', 500);
  }
}

export async function getTopEvents(period: string = 'mes') {
  try {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'semana':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'trimestre':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'año':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const events = await prisma.event.findMany({
      where: {
        date: { gte: startDate },
        isActive: true
      },
      include: {
        _count: {
          select: {
            tickets: {
              where: { status: 'PAID' }
            }
          }
        }
      },
      orderBy: {
        tickets: {
          _count: 'desc'
        }
      },
      take: 10
    });

    const topEvents = await Promise.all(
      events.map(async (event) => {
        const revenue = await prisma.order.aggregate({
          where: {
            tickets: {
              some: {
                eventId: event.id,
                status: 'PAID'
              }
            },
            status: 'PAID'
          },
          _sum: { totalPrice: true }
        });

        return {
          id: event.id,
          name: event.title,
          date: event.date,
          attendees: event._count.tickets,
          revenue: revenue._sum.totalPrice || 0,
          location: event.location || 'No especificada',
          capacity: event.capacity
        };
      })
    );

    return topEvents;
  } catch (error) {
    console.error('Error obteniendo top eventos:', error);
    throw new CustomError('Error al obtener top eventos', 500);
  }
}

export async function getSalesChart(period: string = 'mes') {
  try {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'semana':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'trimestre':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        groupBy = 'week';
        break;
      case 'año':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
    }

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: 'PAID',
        createdAt: { gte: startDate }
      },
      _sum: { totalPrice: true },
      _count: true
    });

    return salesData.map(item => ({
      date: item.createdAt,
      ventas: item._sum.totalPrice || 0,
      ordenes: item._count
    }));
  } catch (error) {
    console.error('Error obteniendo gráfico de ventas:', error);
    throw new CustomError('Error al obtener gráfico de ventas', 500);
  }
}

async function calculateOccupancyRate(startDate: Date): Promise<number> {
  const events = await prisma.event.findMany({
    where: {
      date: { gte: startDate },
      capacity: { not: null },
      isActive: true
    },
    include: {
      _count: {
        select: {
          tickets: {
            where: { status: 'PAID' }
          }
        }
      }
    }
  });

  if (events.length === 0) return 0;

  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity || 0), 0);
  const totalSold = events.reduce((sum, event) => sum + event._count.tickets, 0);

  return totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
}