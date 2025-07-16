// src/api/orders.ts
import { api } from "./apiClient";

// Interfaz que representa la estructura de una orden tal como la devuelve tu API
export interface OrderData {
  id: string;
  userId: string;
  totalPrice: number;
  status: "PENDING" | "PAID" | "CANCELLED"; // Asegúrate de que estos estados coincidan con tu enum OrderStatus en Prisma
  createdAt: string;
  updatedAt: string; // Añadido para consistencia con los modelos de Prisma
  // Si tu backend devuelve más campos, como los tickets asociados o pagos, añádelos aquí.
  // Por ejemplo, si findOrderById incluye tickets:
  tickets?: {
    id: number;
    eventId: string;
    buyerName: string;
    buyerLastName: string;
    buyerEmail: string;
    buyerPhone: string | null;
    buyerDni: string | null;
    status: string; // 'PENDING', 'PAID', 'CANCELLED'
    price: number; // Precio del evento asociado
    // ... otros campos del ticket
  }[];
  Payment?: {
    id: string;
    amount: number;
    method: string;
    status: string; // 'PENDING', 'COMPLETED', 'FAILED'
    createdAt: string;
    updatedAt: string;
    // ... otros campos del pago
  }[];
}

// Interfaz para el payload al crear una orden
export interface CreateOrderPayload {
  userId: string;
  ticketIds: number[]; // Array de IDs de tickets que se asociarán a esta orden
}

/**
 * Crea una nueva orden en el backend.
 * @param payload Los datos para crear la orden (userId y IDs de tickets).
 * @returns Una promesa que resuelve con los datos de la orden creada.
 */
export async function createOrder(
  payload: CreateOrderPayload
): Promise<OrderData> {
  const res = await api.post("/orders", payload);
  return res.data;
}

/**
 * Obtiene una orden específica por su ID.
 * @param id El ID de la orden a obtener.
 * @returns Una promesa que resuelve con el objeto OrderData de la orden.
 */
export async function getOrderById(id: string): Promise<OrderData> {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}

/**
 * Obtiene todas las órdenes del backend.
 * @returns Una promesa que resuelve con un array de objetos OrderData.
 */
export async function getOrders(): Promise<OrderData[]> {
  const res = await api.get("/orders");
  return res.data;
}

// Si necesitas funciones para actualizar o eliminar órdenes, las añadirías aquí:
/*
export async function updateOrder(id: string, data: Partial<OrderData>): Promise<OrderData> {
  const res = await api.put(`/orders/${id}`, data);
  return res.data;
}

export async function deleteOrder(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
}
*/
