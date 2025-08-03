// config/mercadoPago.ts
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Reemplaza 'TU_ACCESS_TOKEN_AQUI' con process.env.MERCADO_PAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken:
    process.env.MP_ACCESS_TOKEN ||
    "TEST-8822652141941168-072717-0266d4fc8688476f7309bfc81679c01e-2569188376",
});

export const mpPayment = new Payment(client);
export const mpPreferences = new Preference(client);
