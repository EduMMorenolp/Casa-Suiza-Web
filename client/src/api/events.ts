// src/api/events.ts

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

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
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) throw new Error("Error al obtener eventos");
  return res.json();
}

// Obtener evento por ID
export async function getEventById(id: string): Promise<EventData> {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) throw new Error("Evento no encontrado");
  return res.json();
}

// Crear nuevo evento
export async function createEvent(event: EventData): Promise<EventData> {
  const res = await fetch(`${API_BASE}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Error al crear evento");
  return res.json();
}

// Actualizar evento
export async function updateEvent(
  id: string,
  event: EventData
): Promise<EventData> {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error("Error al actualizar evento");
  return res.json();
}

// Eliminar evento
export async function deleteEvent(id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar evento");
  return res.json();
}
