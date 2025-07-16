import prisma from "../config/prismaClient";
import { OrderStatus, TicketStatus } from "@prisma/client";
import { CustomError } from "../utils/CustomError";

interface CreateOrderData {
  userId?: string | null; // CAMBIO: Hacer userId opcional y permitir null
  ticketIds: number[]; // IDs de tickets existentes que se asociarán a esta orden
}

/**
 * Crea una nueva orden y asocia tickets existentes a ella.
 * Calcula el precio total de la orden basado en los tickets asociados y el precio de sus eventos.
 * @param data Los datos para crear la orden y los IDs de los tickets.
 * @returns La orden creada.
 * @throws CustomError si algún ticket no es encontrado/ya está asociado.
 */
export async function createOrder(data: CreateOrderData) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        id: { in: data.ticketIds },
      },
      include: {
        event: true,
      },
    });

    if (tickets.length !== data.ticketIds.length) {
      throw new CustomError(
        "Alguno de los tickets proporcionados no fue encontrado.",
        404
      );
    }

    // Verificar que los tickets no estén ya asociados a otra orden o pagados
    for (const ticket of tickets) {
      if (!ticket.event) {
        throw new CustomError(
          `El ticket con ID ${ticket.id} no tiene un evento asociado válido.`,
          400
        );
      }
      if (ticket.orderId !== null) {
        throw new CustomError(
          `El ticket con ID ${ticket.id} ya está asociado a una orden.`,
          400
        );
      }
      if (ticket.status === TicketStatus.PAID) {
        throw new CustomError(
          `El ticket con ID ${ticket.id} ya ha sido pagado.`,
          400
        );
      }
    }

    // Calcular el precio total de la orden sumando el precio de los eventos de cada ticket
    const totalPrice = tickets.reduce(
      (sum, ticket) => sum + ticket.event.price,
      0
    );

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        userId: data.userId || null,
        totalPrice: totalPrice,
        status: OrderStatus.PENDING,
        tickets: {
          connect: data.ticketIds.map((id) => ({ id })),
        },
      },
      include: {
        tickets: true, 
      },
    });

    return order;
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error;
    }
    console.error("Error inesperado al crear la orden:", error);
    throw new CustomError("Error interno al crear la orden.", 500);
  }
}

/**
 * Obtiene todas las órdenes.
 * @returns Una lista de órdenes.
 */
export async function findAllOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
      tickets: {
        include: {
          event: true,
        },
      },
      Payment: true,
    },
  });
}

/**
 * Obtiene una orden por su ID.
 * @param id El ID de la orden.
 * @returns La orden encontrada o null si no existe.
 */
export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      tickets: {
        include: {
          event: true,
        },
      },
      Payment: true,
    },
  });
}

/**
 * Actualiza el estado de una orden.
 * @param orderId El ID de la orden a actualizar.
 * @param status El nuevo estado de la orden.
 * @returns La orden actualizada.
 * @throws CustomError si la orden no es encontrada.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    return await prisma.order.update({
      where: { id: orderId },
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
        "Orden no encontrada para actualizar su estado.",
        404
      );
    }
    throw error;
  }
}

/**
 * Actualiza los datos de una orden existente.
 * @param id El ID de la orden a actualizar.
 * @param data Los datos a actualizar de la orden.
 * @returns La orden actualizada.
 * @throws CustomError si la orden no es encontrada.
 */
export async function updateOrder(
  id: string,
  data: Partial<
    Omit<CreateOrderData, "ticketIds"> & {
      totalPrice?: number;
      status?: OrderStatus;
    }
  >
) {
  try {
    return await prisma.order.update({
      where: { id },
      data: {
        ...data,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Orden no encontrada para actualizar.", 404);
    }
    throw error;
  }
}

/**
 * Elimina una orden por su ID.
 * @param id El ID de la orden a eliminar.
 * @throws CustomError si la orden no es encontrada.
 */
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Orden no encontrada para eliminar.", 404);
    }
    throw error;
  }
}
