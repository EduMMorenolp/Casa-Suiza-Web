import { Router } from "express";
import { createPaymentPreferenceHandler } from "../controllers/paymentController";

const router = Router();

router.post("/create-preference", createPaymentPreferenceHandler);

export default router;
