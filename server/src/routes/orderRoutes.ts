import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
// import { orderValidationRules } from '../validation/orderValidate'; // Si implementas validación

const router = Router();

// Rutas protegidas (ejemplo: todas las operaciones de órdenes para usuarios autenticados, y algunas para admins)
router.post(
  "/order",
  authenticateToken, // Un usuario puede crear su propia orden
  // orderValidationRules.create, // Aplica las reglas de validación si las defines
  createOrder
);
router.get("/order", authenticateToken, verifyAdmin, getAllOrders); // Solo admins pueden ver todas las órdenes
router.get("/order/:id", authenticateToken, getOrderById); // Un usuario puede ver su propia orden si el ID coincide, o admin puede ver cualquiera
router.put(
  "/order/:id",
  authenticateToken,
  verifyAdmin, // Solo admins pueden actualizar órdenes (o quizás un usuario pueda cancelar la suya)
  // orderValidationRules.update, // Aplica las reglas de validación si las defines
  updateOrder
);
router.delete(
  "/order/:id",
  authenticateToken,
  verifyAdmin, // Solo admins pueden eliminar órdenes
  deleteOrder
);

export default router;
