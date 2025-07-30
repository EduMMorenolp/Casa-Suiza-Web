// config/mercadoPago.ts
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Reemplaza 'TU_ACCESS_TOKEN_AQUI' con process.env.MERCADO_PAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken:
    process.env.MP_ACCESS_TOKEN ||
    "APP_USR-6516061950356800-072717-dd6c3f83cc861fa233646c5441aac4d9-2583119160",
});

export const mpPayment = new Payment(client);
export const mpPreferences = new Preference(client);

