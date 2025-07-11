import { Router } from "express";
import { createPaymentPreferenceHandler } from "../controllers/paymentController";

const router = Router();

router.post("/payment/preference", createPaymentPreferenceHandler);

export default router;
