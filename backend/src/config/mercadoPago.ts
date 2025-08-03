// config/mercadoPago.ts
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN environment variable is required");
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const mpPayment = new Payment(client);
export const mpPreferences = new Preference(client);
