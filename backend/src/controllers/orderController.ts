import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService";
import { CustomError } from "../utils/CustomError";
import { OrderStatus } from "@prisma/client";

// Crear una nueva orden
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, ticketIds } = req.body;
    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      throw new CustomError(
        "Faltan datos requeridos para crear la orden (ticketIds).",
        400
      );
    }

    const newOrder = await orderService.createOrder({ userId, ticketIds });
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
}

// Obtener todas las órdenes
export async function getAllOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await orderService.findAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

// Obtener una orden por ID
export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const order = await orderService.findOrderById(id);
    if (!order) {
      throw new CustomError("Orden no encontrada.", 404);
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

// Actualizar una orden existente
export async function updateOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { userId, totalPrice, status } = req.body;

    if (!userId && totalPrice === undefined && status === undefined) {
      throw new CustomError(
        "Se requiere al menos un campo para actualizar la orden.",
        400
      );
    }
    if (
      totalPrice !== undefined &&
      (typeof totalPrice !== "number" || totalPrice < 0)
    ) {
      throw new CustomError(
        "El precio total debe ser un número positivo.",
        400
      );
    }
    if (status !== undefined && !Object.values(OrderStatus).includes(status)) {
      throw new CustomError("Estado de orden inválido.", 400);
    }

    const updatedOrder = await orderService.updateOrder(id, {
      userId,
      totalPrice,
      status,
    });
    // amazonq-ignore-next-line
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

// Eliminar una orden
export async function deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.status(204).end(); 
  } catch (error) {
    next(error);
  }
}
