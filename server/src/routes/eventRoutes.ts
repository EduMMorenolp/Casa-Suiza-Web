import { Router } from "express";
import {
  createEventHandler,
  getEventByIdHandler,
  updateEventHandler,
  deleteEventHandler,
  listEventsHandler,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authTokenMiddleware"; // Asegúrate de importar
import { verifyAdmin } from "../middleware/verifyAdmin"; // Asegúrate de importar

const router = Router();

// Rutas protegidas para administradores (crear, actualizar, eliminar)
router.post("/event", authenticateToken, verifyAdmin, createEventHandler);
router.put("/events/:id", authenticateToken, verifyAdmin, updateEventHandler);
router.delete(
  "/events/:id",
  authenticateToken,
  verifyAdmin,
  deleteEventHandler
);

// Rutas públicas (obtener por ID, listar)
router.get("/events/:id", getEventByIdHandler);
router.get("/events", listEventsHandler); // Listar eventos con filtros opcionales

export default router;
