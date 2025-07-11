import { api } from "./apiClient";

export interface TicketData {
  id?: string;
  eventId: string;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
  purchaseAt?: string;
  status?: "pending" | "paid" | "cancelled";
}

// Crear nuevo ticket (compra)
export async function createTicket(data: TicketData): Promise<TicketData> {
  const res = await api.post("/tickets", data);
  return res.data;
}

// Obtener todos los tickets de un evento
export async function getTicketsByEvent(
  eventId: string
): Promise<TicketData[]> {
  const res = await api.get(`/events/${eventId}/tickets`);
  return res.data;
}

// Obtener un ticket específico
export async function getTicketById(id: string): Promise<TicketData> {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
}

// Actualizar estado del ticket (opcional)
export async function updateTicketStatus(
  id: string,
  status: "pending" | "paid" | "cancelled"
) {
  const res = await api.put(`/tickets/${id}`, { status });
  return res.data;
}

// Eliminar un ticket (opcional)
export async function deleteTicket(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
}
