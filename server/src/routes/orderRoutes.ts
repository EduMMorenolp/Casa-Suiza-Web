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

// Rutas
router.post(
  "/order",
  createOrder
);
router.get("/order", authenticateToken, verifyAdmin, getAllOrders);
router.get("/order/:id", getOrderById);
router.put(
  "/order/:id",
  authenticateToken,
  verifyAdmin,
  updateOrder
);
router.delete(
  "/order/:id",
  authenticateToken,
  verifyAdmin, 
  deleteOrder
);

export default router;
