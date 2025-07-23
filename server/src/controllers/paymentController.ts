import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/paymentService";
import { CustomError } from "../utils/CustomError";
import {
  handleMercadoPagoWebhook,
  processPaymentFromBrick,
} from "../services/paymentService";

export async function createPaymentPreferenceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      orderId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      buyerDni,
      amount,
    } = req.body;

    if (
      !orderId ||
      !buyerName ||
      !buyerLastName ||
      !buyerEmail ||
      !buyerDni ||
      amount === undefined
    ) {
      throw new CustomError(
        "Faltan datos requeridos para crear la preferencia de pago (orderId, datos del comprador, monto).",
        400
      );
    }

    const preferenceData = {
      orderId: orderId,
      amount: amount,
      buyerName: buyerName,
      buyerLastName: buyerLastName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      buyerDni: buyerDni,
    };

    const { preferenceId } = await paymentService.createPreferenceForBricks(
      preferenceData
    );

    const now = new Date().toLocaleString();
    console.log("===============================================");
    console.log(`🕒 [${now}] Preferencia de pago creada para Brick:`);
    console.log(`🪪 ID Preferencia: ${preferenceId}`);
    console.log("===============================================\n");

    res.status(201).json({ preferenceId });
  } catch (error) {
    next(error);
  }
}

export async function processPaymentControllerexport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await processPaymentFromBrick(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en el controlador de pago:", error.message);
    res.status(error.status || 500).json({
      error: error.message || "Error interno al procesar el pago.",
    });
  }
}

export async function processPaymentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      orderId,
      paymentMethodId,
      token,
      installments,
      issuerId,
      payer,
      transactionAmount,
      description,
    } = req.body;

    if (
      !orderId ||
      !paymentMethodId ||
      !token ||
      !installments ||
      !payer ||
      !transactionAmount ||
      !description
    ) {
      throw new CustomError(
        "Faltan datos requeridos para procesar el pago.",
        400
      );
    }

    const paymentResult = await paymentService.processPaymentFromBrick({
      orderId,
      paymentMethodId,
      token,
      installments,
      issuerId,
      payer,
      transactionAmount,
      description,
    });

    const now = new Date().toLocaleString();
    console.log("===============================================");
    console.log(`🕒 [${now}] Pago procesado por Brick:`);
    console.log(`📦 ID Pago MP: ${paymentResult.id}`);
    console.log(`📊 Estado: ${paymentResult.status}`);
    console.log(`📊 Detalle de Estado: ${paymentResult.statusDetail}`);
    console.log(`🛒 Orden ID: ${paymentResult.orderId}`);
    console.log("===============================================\n");

    res.status(200).json(paymentResult);
  } catch (error) {
    next(error);
  }
}

export async function handleMercadoPagoWebhookController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id, topic } = req.query;

    if (!id || !topic) {
      console.warn("Webhook de MercadoPago recibido sin ID o topic.");
      res.status(400).send("Bad Request: Missing ID or topic.");
      return;
    }

    await handleMercadoPagoWebhook(id as string, topic as string);

    res.status(200).send("Webhook procesado.");
  } catch (error) {
    next(error);
  }
}

export async function handlePaymentSuccess(
  req: Request,
  res: Response
): Promise<void> {
  res.status(200).send("¡Pago exitoso! La confirmación está en camino.");
}

export async function handlePaymentFailure(
  req: Request,
  res: Response
): Promise<void> {
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
