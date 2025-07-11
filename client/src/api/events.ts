import { api } from "./apiClient";

export interface EventData {
  id?: string;
  title: string;
  description?: string;
  time?: string;
  location?: string;
  date: string; // ISO string
  price: number;
  promo?: boolean;
  soldOut?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Obtener todos los eventos
export async function getEvents(): Promise<EventData[]> {
  const res = await api.get("/events");
  return res.data;
}

// Obtener evento por ID
export async function getEventById(id: string): Promise<EventData> {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

// Crear nuevo evento
export async function createEvent(event: EventData): Promise<EventData> {
  const res = await api.post("/event", event);
  return res.data;
}

// Actualizar evento
export async function updateEvent(
  id: string,
  event: EventData
): Promise<EventData> {
  const res = await api.put(`/events/${id}`, event);
  return res.data;
}

// Eliminar evento
export async function deleteEvent(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/events/${id}`);
  return res.data;
}
