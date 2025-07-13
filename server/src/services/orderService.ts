import prisma from "../config/prismaClient";
import { OrderStatus, TicketStatus } from "@prisma/client";
import { CustomError } from "../utils/CustomError";

interface CreateOrderData {
  userId: string;
  ticketIds: number[]; // IDs de tickets existentes que se asociarán a esta orden
}

/**
 * Crea una nueva orden y asocia tickets existentes a ella.
 * Calcula el precio total de la orden basado en los tickets asociados y el precio de sus eventos.
 * @param data Los datos para crear la orden y los IDs de los tickets.
 * @returns La orden creada.
 * @throws CustomError si el usuario no es encontrado o algún ticket no es encontrado/ya está asociado.
 */
export async function createOrder(data: CreateOrderData) {
  try {
    // Verificar que el usuario exista
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new CustomError("Usuario no encontrado para crear la orden.", 404);
    }

    // Obtener los tickets y verificar su existencia y estado, incluyendo la información del evento
    const tickets = await prisma.ticket.findMany({
      where: {
        id: { in: data.ticketIds },
      },
      include: {
        event: true, // Incluimos el evento asociado a cada ticket para obtener el precio
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
        userId: data.userId,
        totalPrice: totalPrice,
        status: OrderStatus.PENDING,
        tickets: {
          connect: data.ticketIds.map((id) => ({ id })), // Asociar los tickets
        },
      },
      include: {
        tickets: true, // Incluir los tickets en la respuesta
      },
    });

    return order;
  } catch (error: unknown) {
    // Tipado de error a unknown
    // Re-lanzar CustomError directamente
    if (error instanceof CustomError) {
      throw error;
    }
    // Manejo de otros errores desconocidos o de Prisma
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
          event: true, // Incluimos el evento para mostrar el precio si es necesario
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
          event: true, // Incluimos el evento para mostrar el precio si es necesario
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
        // No se permite actualizar tickets directamente desde aquí.
        // Si se necesita re-asociar tickets, se debe hacer con un método específico.
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
    // Antes de eliminar la orden, podrías querer desvincular los tickets
    // o manejar su estado si la orden es eliminada.
    // Por simplicidad, aquí solo se elimina la orden.
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
