import { Request, Response } from "express";
import { createPreference } from "../services/paymentService";

export async function createPaymentPreferenceHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      ticketId,
      buyerName,
      buyerLastName,
      buyerEmail,
      buyerPhone,
      eventTitle,
      price,
    } = req.body;

    if (!ticketId || !buyerName || !buyerEmail || !eventTitle || !price) {
      res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const preferenceData = {
      items: [
        {
          id: ticketId,
          title: eventTitle,
          quantity: 1,
          unit_price: Number(price),
        },
      ],
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
    };

    const preference = await createPreference(preferenceData, "approved");

    const now = new Date().toLocaleString();

    console.log("===============================================");
    console.log(`🕒 [${now}] Preferencia de pago creada:`);
    console.log(`📦 Estado: ${preference.status}`);
    console.log(`🪪 ID Preferencia: ${preference.id}`);
    console.log("===============================================\n");

    res
      .status(201)
      .json({ preferenceId: preference.id, initPoint: preference.init_point });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error creando preferencia de pago" });
  }
}
