import { Router } from "express";
import {
  createEventHandler,
  getEventByIdHandler,
  updateEventHandler,
  deleteEventHandler,
  listEventsHandler,
  getDashboardStatsHandler,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
import { uploadImage } from "../middleware/uploadMiddleware";

const router = Router();

// Rutas públicas (obtener por ID, listar)
router.get("/events", listEventsHandler); // Listar eventos con filtros opcionales
router.get("/events/:id", getEventByIdHandler);

// Rutas protegidas para administradores (crear, actualizar, eliminar)
router.post("/event", uploadImage.single('image'), createEventHandler);
router.put("/events/:id", uploadImage.single('image'), updateEventHandler);
router.delete(
  "/events/:id",
  deleteEventHandler
);

// Estadísticas del dashboard (admin)
router.get("/dashboard/stats", authenticateToken, verifyAdmin, getDashboardStatsHandler);

export default router;
