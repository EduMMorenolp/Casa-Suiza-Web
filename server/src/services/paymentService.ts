import mercadopago from "../config/mercadoPago";
import prisma from "../config/prismaClient";
import { PaymentStatus, OrderStatus, TicketStatus } from "@prisma/client";
import { CustomError } from "../utils/CustomError";
import * as orderService from "./orderService"; 
import * as ticketService from "./ticketService";

interface PaymentPreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface PaymentPreferenceData {
  items: PaymentPreferenceItem[];
  payer: {
    name: string;
    surname: string;
    email: string;
    phone?: {
      area_code: string;
      number: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: "approved" | "all" | "none";
  notification_url: string;
  external_reference?: string;
}

interface MockPreferenceResponse {
  id: string;
  status: string; // Para que puedas cambiarlo
  init_point: string;
  items: PaymentPreferenceData["items"];
  payer: PaymentPreferenceData["payer"];
  [key: string]: any; // Otros campos opcionales
}

/**
 * Crea una preferencia de pago en MercadoPago.
 * @param data Los datos para la preferencia de pago.
 * @param mockStatus Estado de mock para pruebas.
 * @returns La respuesta de la preferencia de pago.
 */
export async function createPreference(
  data: PaymentPreferenceData,
  mockStatus = "pending"
): Promise<MockPreferenceResponse> {
  try {
    // Descomentar la siguiente línea para usar la API real de MercadoPago
    // const response = await mercadopago.preferences.create(data);
    // return response.body;

    // Simulación de respuesta de MercadoPago para desarrollo
    return {
      id: `MOCK_ID_${Date.now()}`, // ID único para cada preferencia
      status: mockStatus, // "pending", "approved", "cancelled", etc.
      init_point:
        "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_ID_123456", // URL de checkout de MP
      items: data.items,
      payer: data.payer,
      back_urls: data.back_urls,
      notification_url: data.notification_url,
      external_reference: data.external_reference, // Aseguramos que se incluye
    };
  } catch (error: unknown) {
    console.error("Error creando preferencia de pago en MercadoPago:", error);
    throw new CustomError(
      "Error al crear la preferencia de pago en MercadoPago.",
      500
    );
  }
}

/**
 * Maneja las notificaciones de webhook de MercadoPago.
 * Actualiza el estado del pago, la orden y los tickets asociados.
 * @param paymentId El ID del pago de MercadoPago.
 * @param topic El tipo de notificación (e.g., 'payment').
 * @returns El estado de la operación.
 */
export async function handleMercadoPagoWebhook(
  paymentId: string,
  topic: string
) {
  if (topic === "payment") {
    try {
      // Obtener los detalles del pago de MercadoPago
      // Descomentar para producción
      // const payment = await mercadopago.payment.findById(Number(paymentId));
      // const paymentStatus = payment.body.status;
      // const externalReference = payment.body.external_reference; // Aquí debería estar el ID de tu orden

      // Simular respuesta de MercadoPago para desarrollo
      const simulatedPayment = {
        status: "approved", // 'approved', 'rejected', 'pending'
        external_reference: "ORDER_UUID_EXAMPLE", // Reemplazar con un ID de orden real para pruebas
        transaction_amount: 100.0, // Monto simulado
        // ... otras propiedades relevantes de MercadoPago
      };
      const paymentStatus = simulatedPayment.status;
      const externalReference = simulatedPayment.external_reference;

      if (!externalReference) {
        console.warn(
          `Webhook recibido sin external_reference para paymentId: ${paymentId}`
        );
        return {
          success: false,
          message: "Referencia externa no encontrada en el pago.",
        };
      }

      // Buscar la orden en tu base de datos usando external_reference
      const order = await prisma.order.findUnique({
        where: { id: externalReference },
        include: { tickets: true },
      });

      if (!order) {
        console.error(
          `Orden no encontrada para external_reference: ${externalReference}`
        );
        return { success: false, message: "Orden no encontrada." };
      }

      let newPaymentStatus: PaymentStatus;
      let newOrderStatus: OrderStatus;
      let newTicketStatus: TicketStatus;

      switch (paymentStatus) {
        case "approved":
          newPaymentStatus = PaymentStatus.COMPLETED;
          newOrderStatus = OrderStatus.PAID;
          newTicketStatus = TicketStatus.PAID;
          break;
        case "rejected":
          newPaymentStatus = PaymentStatus.FAILED;
          newOrderStatus = OrderStatus.CANCELLED;
          newTicketStatus = TicketStatus.CANCELLED;
          break;
        case "pending":
          newPaymentStatus = PaymentStatus.PENDING;
          newOrderStatus = OrderStatus.PENDING;
          newTicketStatus = TicketStatus.PENDING;
          break;
        default:
          console.warn(
            `Estado de pago desconocido de MercadoPago: ${paymentStatus}`
          );
          return { success: false, message: "Estado de pago desconocido." };
      }

      // 1. Crear o actualizar el registro de Payment en tu DB
      // Si ya existe un Payment para esta orden y preferencia, actualízalo.
      // Si no, crea uno nuevo.
      const existingPayment = await prisma.payment.findFirst({
        where: {
          orderId: order.id,
          // Podrías añadir un campo para el ID de preferencia de MP si lo guardas
        },
      });

      if (existingPayment) {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: newPaymentStatus },
        });
      } else {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            amount: simulatedPayment.transaction_amount, // Usar el monto real de MP
            method: "MercadoPago", // O el método real de MP
            status: newPaymentStatus,
          },
        });
      }

      // 2. Actualizar el estado de la Orden
      await orderService.updateOrderStatus(order.id, newOrderStatus);

      // 3. Actualizar el estado de los Tickets asociados
      for (const ticket of order.tickets) {
        await ticketService.updateTicketStatus(ticket.id, newTicketStatus);
      }

      console.log(
        `Webhook procesado exitosamente para orden ${order.id}. Nuevo estado: ${newOrderStatus}`
      );
      return { success: true, message: "Webhook procesado exitosamente." };
    } catch (error: unknown) {
      console.error("Error procesando webhook de MercadoPago:", error);
      throw new CustomError(
        "Error interno al procesar el webhook de pago.",
        500
      );
    }
  }
  return {
    success: false,
    message: "Tipo de notificación de webhook no soportado.",
  };
}
