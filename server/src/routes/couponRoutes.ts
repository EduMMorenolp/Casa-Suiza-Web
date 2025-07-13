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
  "/",
  authenticateToken,
  verifyAdmin,
  // couponValidationRules.create, // Aplica las reglas de validación si las defines
  createCoupon
);
router.get("/", authenticateToken, verifyAdmin, getAllCoupons);
router.get("/:id", authenticateToken, verifyAdmin, getCouponById);
router.put(
  "/:id",
  authenticateToken,
  verifyAdmin,
  // couponValidationRules.update, // Aplica las reglas de validación si las defines
  updateCoupon
);
router.delete("/:id", authenticateToken, verifyAdmin, deleteCoupon);

export default router;
