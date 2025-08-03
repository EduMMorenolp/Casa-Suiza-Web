import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
// import { couponValidationRules } from '../validation/couponValidate'; // Si implementas validación

const router = Router();

// Rutas protegidas (ejemplo: todas las operaciones de cupones para admins)
router.post(
  // amazonq-ignore-next-line
  "/cuopon",
  authenticateToken,
  verifyAdmin,
  // couponValidationRules.create, // Aplica las reglas de validación si las defines
  createCoupon
);
router.get("/cuopon/", authenticateToken, verifyAdmin, getAllCoupons);
router.get("/cuopon/:id", authenticateToken, verifyAdmin, getCouponById);
router.put(
  "/cuopon/:id",
  authenticateToken,
  verifyAdmin,
  // couponValidationRules.update, // Aplica las reglas de validación si las defines
  updateCoupon
);
router.delete("/cuopon/:id", authenticateToken, verifyAdmin, deleteCoupon);

export default router;
