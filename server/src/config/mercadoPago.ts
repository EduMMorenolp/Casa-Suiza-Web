// config/mercadoPago.ts
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import dotenv from "dotenv";

// Configuracion
dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN || "";

if (!accessToken) {
  throw new Error("Mercado Pago Access Token is not defined in environment variables.");
}

// Reemplaza 'TU_ACCESS_TOKEN_AQUI' con process.env.MERCADO_PAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
  accessToken:
    accessToken
});

export const mpPayment = new Payment(client);
export const mpPreferences = new Preference(client);
