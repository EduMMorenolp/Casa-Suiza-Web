import { mpPayment, mpPreferences } from "../config/mercadoPago";
import prisma from "../config/prismaClient";
import { PaymentStatus, OrderStatus, TicketStatus } from "@prisma/client";
import { CustomError } from "../utils/CustomError";
import * as orderService from "./orderService";
import * as ticketService from "./ticketService";

interface CreatePreferenceRequest {
  orderId: string;
  amount: number;
  buyerName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerDni: string;
}

interface CreatePreferenceResponse {
  preferenceId: string;
}

interface ProcessPaymentRequest {
  orderId: string;
  paymentMethodId: string;
  token: string;
  installments: number;
  issuerId?: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
  transactionAmount: number;
  description: string;
}

interface ProcessPaymentResponse {
  id: string;
  status: string;
  statusDetail: string;
  orderId: string;
}

export async function createPreferenceForBricks(
  data: CreatePreferenceRequest
): Promise<CreatePreferenceResponse> {
  try {
    const preferenceData = {
      items: [
        {
          id: data.orderId,
          title: "Compra de Entradas",
          quantity: 1,
          unit_price: data.amount,
        },
      ],
      payer: {
        name: data.buyerName,
        surname: data.buyerLastName,
        email: data.buyerEmail,
        phone: data.buyerPhone
          ? {
              area_code: data.buyerPhone.substring(0, 2),
              number: data.buyerPhone.substring(2),
            }
          : undefined,
        identification: {
          type: "DNI",
          number: data.buyerDni,
        },
      },
      external_reference: data.orderId,
    };

    const response = await mpPreferences.create({ body: preferenceData });
    if (!response.id) {
      throw new CustomError(
        "La respuesta de MercadoPago no contiene un ID de preferencia.",
        500
      );
    }
    return { preferenceId: response.id };
  } catch (error: unknown) {
    console.error(
      "Error creando preferencia de pago para Bricks en MercadoPago:",
      error
    );
    throw new CustomError(
      "Error al crear la preferencia de pago en MercadoPago.",
      500
    );
  }
}

export async function processPaymentFromBrick(
  data: ProcessPaymentRequest
): Promise<ProcessPaymentResponse> {
  try {
    const paymentData = {
      transaction_amount: data.transactionAmount,
      token: data.token,
      description: data.description,
      installments: data.installments,
      payment_method_id: data.paymentMethodId,
      issuer_id: data.issuerId ? Number(data.issuerId) : undefined,
      payer: {
        email: data.payer.email,
        identification: {
          type: data.payer.identification.type,
          number: data.payer.identification.number,
        },
      },
      external_reference: data.orderId,
    };

    const paymentResult = await mpPayment.create({ body: paymentData });

    if (!paymentResult.id) {
      throw new CustomError(
        "La respuesta de MercadoPago no contiene un ID de pago.",
        500
      );
    }

    await handlePaymentResult(
      String(paymentResult.id),
      String(paymentResult.status),
      paymentResult.external_reference ?? "",
      paymentResult.transaction_amount ?? 0
    );

    return {
      id: String(paymentResult.id),
      status: String(paymentResult.status),
      statusDetail: paymentResult.status_detail ?? "",
      orderId: paymentResult.external_reference ?? "",
    };
  } catch (error: any) {
    console.error(
      "Error al procesar el pago desde el Brick:",
      error.response ? error.response.data : error.message
    );
    const errorMessage =
      error.response?.data?.message ||
      "Error al procesar el pago con Mercado Pago.";
    throw new CustomError(errorMessage, error.response?.status || 500);
  }
}

async function handlePaymentResult(
  mpPaymentId: string,
  mpPaymentStatus: string,
  externalReference: string,
  transactionAmount: number
) {
  if (!externalReference) {
    console.warn(
      `Pago recibido sin external_reference para paymentId: ${mpPaymentId}`
    );
    throw new CustomError("Referencia externa no encontrada en el pago.", 400);
  }

  const order = await prisma.order.findUnique({
    where: { id: externalReference },
    include: { tickets: true },
  });

  if (!order) {
    console.error(
      `Orden no encontrada para external_reference: ${externalReference}`
    );
    throw new CustomError("Orden no encontrada.", 404);
  }

  let newPaymentStatus: PaymentStatus;
  let newOrderStatus: OrderStatus;
  let newTicketStatus: TicketStatus;

  switch (mpPaymentStatus) {
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
        `Estado de pago desconocido de MercadoPago: ${mpPaymentStatus}`
      );
      throw new CustomError("Estado de pago desconocido.", 400);
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId: order.id,
    },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: newPaymentStatus,
        mpPaymentId: mpPaymentId,
        amount: transactionAmount,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: transactionAmount,
        method: "MercadoPago",
        status: newPaymentStatus,
        mpPaymentId: mpPaymentId,
      },
    });
  }

  await orderService.updateOrderStatus(order.id, newOrderStatus);

  for (const ticket of order.tickets) {
    await ticketService.updateTicketStatus(ticket.id, newTicketStatus);
  }

  console.log(
    `Pago procesado exitosamente para orden ${order.id}. Nuevo estado: ${newOrderStatus}`
  );
}

export async function handleMercadoPagoWebhook(
  paymentId: string,
  topic: string
) {
  if (topic === "payment") {
    try {
      const payment = await mpPayment.get({ id: Number(paymentId) });
      const paymentStatus = payment.status ?? "";
      const externalReference = payment.external_reference ?? "";
      const transactionAmount = payment.transaction_amount ?? 0;

      await handlePaymentResult(
        paymentId,
        paymentStatus,
        externalReference,
        transactionAmount
      );

      console.log(
        `Webhook procesado exitosamente para paymentId ${paymentId}.`
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
