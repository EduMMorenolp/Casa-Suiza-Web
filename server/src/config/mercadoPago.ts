// config/mercadoPago.ts
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Reemplaza 'TU_ACCESS_TOKEN_AQUI' con process.env.MERCADO_PAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken:
    process.env.MERCADO_PAGO_ACCESS_TOKEN ||
    "TEST-4325730232219110-071802-bfd15718809c38cb57548882482216d6-2569188376",
});

export const mpPayment = new Payment(client);
export const mpPreferences = new Preference(client);
