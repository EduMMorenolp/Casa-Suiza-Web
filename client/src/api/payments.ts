import { api } from "./apiClient";

// Interfaz para los datos que se envían al backend para crear una preferencia de pago
export interface PreferenceData {
  // Ahora la preferencia se puede crear directamente con un orderId
  orderId?: string; // CAMBIO: Añadimos orderId como opcional

  // Si no hay orderId, se pueden proporcionar los detalles del ticket/evento directamente
  // (Aunque es preferible usar orderId si la compra es de múltiples tickets)
  ticketId?: string; // Si es para un solo ticket sin orden previa
  buyerName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  eventTitle?: string;
  price?: number; // Precio total si no hay orderId

  // Estos campos son para MercadoPago y se pueden manejar en el backend si se pasa orderId
  // items: PaymentPreferenceItem[]; // Los items se construyen en el backend
  // payer: { ... }; // El payer se construye en el backend
  // back_urls: { ... };
  // auto_return: "approved" | "all" | "none";
  // notification_url: string;
  // external_reference?: string;
}

// Interfaz para la respuesta del backend al crear una preferencia de pago
export interface PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

/**
 * Crea una preferencia de pago en el backend.
 * Puedes enviar un `orderId` para que el backend construya la preferencia
 * o los detalles de un solo ticket/evento si no hay una orden pre-existente.
 * @param data Los datos para crear la preferencia de pago.
 * @returns Una promesa que resuelve con el ID de preferencia y el initPoint de MercadoPago.
 */
export async function createPaymentPreference(
  data: PreferenceData
): Promise<PaymentPreferenceResponse> {
  const res = await api.post("/payments/preference", data); 
  return res.data;
}
