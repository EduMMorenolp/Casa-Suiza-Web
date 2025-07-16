import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { verifyAdmin } from "../middleware/verifyAdmin";
// import { categoryValidationRules } from '../validation/categoryValidate'; // Si implementas validación

const router = Router();

// Rutas públicas (ejemplo: obtener todas las categorías, obtener por ID)
router.get("/category/", getAllCategories);
router.get("/category/:id", getCategoryById);

// Rutas protegidas (ejemplo: crear, actualizar, eliminar solo para admins)
router.post(
  "/category/",
  // authenticateToken,
  // verifyAdmin,
  // categoryValidationRules.create, // Aplica las reglas de validación si las defines
  createCategory
);
router.put(
  "/category/:id",
  authenticateToken,
  verifyAdmin,
  // categoryValidationRules.update, // Aplica las reglas de validación si las defines
  updateCategory
);
router.delete("/category/:id", authenticateToken, verifyAdmin, deleteCategory);

export default router;
