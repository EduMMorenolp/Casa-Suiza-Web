import { Router } from "express";
import {
  createTicketHandler,
  getAllTickets,
  getTicketById,
  updateTicketController,
  deleteTicketController,
} from "../controllers/ticketController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
// import { ticketValidationRules } from '../validation/ticketValidate'; // Si implementas validación

const router = Router();

// Rutas públicas
router.post("/ticket", createTicketHandler);

// Rutas protegidas (ejemplo: obtener, actualizar, eliminar solo para admins)
router.get("/ticket", authenticateToken, verifyAdmin, getAllTickets);
router.get("/ticket/:id", authenticateToken, verifyAdmin, getTicketById);
router.put(
  "/ticket/:id",
  authenticateToken,
  verifyAdmin,
  // ticketValidationRules.update, // Aplica las reglas de validación si las defines
  updateTicketController
);
router.delete(
  "/ticket/:id",
  authenticateToken,
  verifyAdmin,
  deleteTicketController
);

export default router;
