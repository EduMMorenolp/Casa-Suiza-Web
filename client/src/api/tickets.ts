import { api } from "./apiClient";

// Interfaz que representa la estructura de un Ticket tal como la devuelve tu API
export interface TicketData {
  id: number; // CAMBIO: De 'string' a 'number' para coincidir con Prisma Int @id
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string | null; // CAMBIO: Ahora puede ser 'string' o 'null'
  buyerDni: string;
  status: string; // 'PENDING', 'PAID', 'CANCELLED'
  checkedIn: boolean;
  purchaseAt: string; // Date como ISO string
  // Si tu backend devuelve más campos (ej. createdAt, updatedAt, price), añádelos aquí
  price: number; // Asumo que el ticket creado en el backend tiene un precio
  couponId: string | null;
  orderId: string | null;
}

// Interfaz para el payload al crear un ticket (lo que se envía al backend)
export interface CreateTicketPayload {
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string | null; // Puede ser opcional y nulo al enviar
  buyerDni: string;
  // El precio y la cantidad no se envían aquí, se manejan en el backend
}

/**
 * Crea un nuevo ticket en el backend.
 * @param payload Los datos para crear el ticket.
 * @returns Una promesa que resuelve con los datos del ticket creado.
 */
export async function createTicket(
  payload: CreateTicketPayload
): Promise<TicketData> {
  const res = await api.post("/tickets", payload); // Asegúrate que la ruta sea '/tickets'
  return res.data;
}

/**
 * Obtiene un ticket por su ID.
 * @param id El ID del ticket.
 * @returns Una promesa que resuelve con los datos del ticket.
 */
export async function getTicketById(id: number): Promise<TicketData> {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
}

// Puedes añadir más funciones si las necesitas (ej. getTickets, updateTicket, deleteTicket)
/*
export async function getTickets(): Promise<TicketData[]> {
  const res = await api.get("/tickets");
  return res.data;
}

export async function updateTicket(id: number, data: Partial<CreateTicketPayload>): Promise<TicketData> {
  const res = await api.put(`/tickets/${id}`, data);
  return res.data;
}

export async function deleteTicket(id: number): Promise<{ message: string }> {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
}
*/
