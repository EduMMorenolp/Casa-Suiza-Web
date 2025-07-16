import { Request, Response, NextFunction } from "express";
import {
  createPreference,
  handleMercadoPagoWebhook,
} from "../services/paymentService";
import { CustomError } from "../utils/CustomError";
import * as orderService from "../services/orderService"; // Importamos el servicio de órdenes
import * as ticketService from "../services/ticketService"; // Importamos el servicio de tickets

// Handler para crear preferencia de pago
export async function createPaymentPreferenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      orderId,
      ticketId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
    } = req.body;

    // Validar que orderId o al menos ticketId y buyerEmail estén presentes
    if (!orderId && (!ticketId || !buyerName || !buyerEmail)) {
      throw new CustomError(
        "Faltan datos requeridos para crear la preferencia de pago (orderId o ticketId, buyerName, buyerEmail).",
        400
      );
    }

    let items: any[] = []; // Usamos any temporalmente, luego tipar con PaymentPreferenceItem
    let totalAmount: number = 0;
    let externalReference: string | undefined = undefined; // Para vincular con la orden o ticket

    if (orderId) {
      // Si recibimos un orderId, buscamos la orden y sus tickets para construir la preferencia
      const order = await orderService.findOrderById(orderId);
      if (!order) {
        throw new CustomError(
          "Orden no encontrada para generar la preferencia de pago.",
          404
        );
      }

      // Asegurarse de que los tickets tienen la relación 'event' cargada
      // (orderService.findOrderById ya lo hace con include: { tickets: { include: { event: true } } })
      items = order.tickets.map((ticket) => {
        if (!ticket.event) {
          throw new CustomError(
            `El ticket con ID ${ticket.id} no tiene un evento asociado válido.`,
            500
          );
        }
        return {
          id: ticket.id.toString(),
          title: ticket.event.title,
          quantity: 1,
          unit_price: ticket.event.price,
        };
      });
      totalAmount = order.totalPrice;
      externalReference = order.id;
    } else if (ticketId) {
      // Si recibimos un ticketId, buscamos el ticket y su evento para construir la preferencia
      const ticket = await ticketService.findTicketById(Number(ticketId));
      if (!ticket || !ticket.event) {
        throw new CustomError(
          "Ticket o evento asociado no encontrado para generar la preferencia de pago.",
          404
        );
      }

      items = [
        {
          id: ticket.id.toString(),
          title: ticket.event.title,
          quantity: 1,
          unit_price: ticket.event.price,
        },
      ];
      totalAmount = ticket.event.price;
      externalReference = ticket.id.toString();
    } else {
      throw new CustomError(
        "Se requiere un ID de orden o un ID de ticket para crear la preferencia de pago.",
        400
      );
    }

    const preferenceData = {
      items: items,
      payer: {
        name: buyerName,
        surname: buyerLastName,
        email: buyerEmail,
        phone: buyerPhone
          ? {
              area_code: buyerPhone.slice(0, 2),
              number: buyerPhone.slice(2),
            }
          : undefined,
      },
      back_urls: {
        success: `${process.env.BASE_URL}/payment/success`,
        failure: `${process.env.BASE_URL}/payment/failure`,
        pending: `${process.env.BASE_URL}/payment/pending`,
      },
      auto_return: "approved" as "approved" | "all" | "none",
      notification_url: `${process.env.BASE_URL}/payment/webhook`,
      external_reference: externalReference,
    };

    const preference = await createPreference(preferenceData, "approved"); // 'approved' es para el mock

    const now = new Date().toLocaleString();
    console.log("===============================================");
    console.log(`🕒 [${now}] Preferencia de pago creada:`);
    console.log(`📦 Estado: ${preference.status}`);
    console.log(`🪪 ID Preferencia: ${preference.id}`);
    console.log("===============================================\n");

    res
      .status(201)
      .json({ preferenceId: preference.id, initPoint: preference.init_point });
  } catch (error) {
    next(error);
  }
}

// Handler para el webhook de MercadoPago
export async function handleMercadoPagoWebhookController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id, topic } = req.query; // MercadoPago envía 'id' (ID de pago) y 'topic' (tipo de notificación)

    if (!id || !topic) {
      console.warn("Webhook de MercadoPago recibido sin ID o topic.");
      res.status(400).send("Bad Request: Missing ID or topic.");
      return;
    }

    // Procesar el webhook
    const result = await handleMercadoPagoWebhook(
      id as string,
      topic as string
    );

    if (result.success) {
      res.status(200).send("Webhook procesado.");
    } else {
      console.error(`Error al procesar webhook: ${result.message}`);
      res.status(400).send(`Error al procesar webhook: ${result.message}`);
    }
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

// Handlers para las URLs de retorno de MercadoPago (éxito, fallo, pendiente)
// Estos son típicamente para el frontend, para mostrar un mensaje al usuario.
// No realizan lógica de negocio crítica, ya que el webhook es la fuente de verdad.
export async function handlePaymentSuccess(
  req: Request,
  res: Response
): Promise<void> {
  // Aquí podrías redirigir a una página de éxito o renderizar una vista
  res.status(200).send("¡Pago exitoso! Gracias por tu compra.");
}

export async function handlePaymentFailure(
  req: Request,
  res: Response
): Promise<void> {
  // Aquí podrías redirigir a una página de fallo o renderizar una vista
  res.status(200).send("El pago ha fallado. Por favor, inténtalo de nuevo.");
}

export async function handlePaymentPending(
  req: Request,
  res: Response
): Promise<void> {
  res
    .status(200)
    .send(
      "Tu pago está pendiente de aprobación. Te notificaremos cuando se complete."
    );
}
