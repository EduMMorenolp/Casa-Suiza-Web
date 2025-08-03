import { Router } from "express";
import {
  createSubscriber,
  getAllSubscribers,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
} from "../controllers/subscriberController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
import { subscriberValidationRules } from "../validation/subscriberValidate";

const router = Router();

// Ruta pública para que cualquier usuario pueda suscribirse
router.post("/subscribers", createSubscriber);

// Rutas protegidas para administradores (obtener, actualizar, eliminar suscriptores)
router.get("/subscribers", authenticateToken, verifyAdmin, getAllSubscribers);
router.get(
  "/subscribers/:id",
  authenticateToken,
  verifyAdmin,
  getSubscriberById
);
router.put(
  "/subscribers/:id",
  authenticateToken,
  verifyAdmin,
  subscriberValidationRules.update,
  updateSubscriber
);
router.delete(
  "/subscribers/:id",
  authenticateToken,
  verifyAdmin,
  deleteSubscriber
);

export default router;
