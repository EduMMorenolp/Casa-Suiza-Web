import { Router } from "express";
import {
  createPaymentPreferenceHandler,
  handleMercadoPagoWebhookController,
  handlePaymentSuccess,
  handlePaymentFailure,
  handlePaymentPending,
} from "../controllers/paymentController";

const router = Router();

// Ruta para crear una preferencia de pago (normalmente llamada desde el frontend)
router.post("/preference", createPaymentPreferenceHandler);

// Rutas de retorno de MercadoPago (para el navegador del usuario)
router.get("/success", handlePaymentSuccess);
router.get("/failure", handlePaymentFailure);
router.get("/pending", handlePaymentPending);

// Ruta para el webhook de MercadoPago (llamada por MercadoPago cuando hay un cambio de estado en el pago)
router.post("/webhook", handleMercadoPagoWebhookController);

export default router;
