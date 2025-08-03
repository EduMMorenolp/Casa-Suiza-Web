// ./src/routes/userRoutes.js

import express from "express";
import {
  deleteUser,
  getUserById,
  updateUser,
  getUsersWithTicketStats,
  toggleUserActiveController,
} from "../controllers/userController";

// Middlewares
import { authenticateToken } from "../middleware/authTokenMiddleware";
import { checkUserActiveMiddleware } from "../middleware/checkUserActiveMiddleware";

import { validateUpdateUser } from "../validation/userValidate";
import { handleValidationErrors } from "../middleware/errorHandler";

const router = express.Router();

/**
 * Rutas de usuarios
 */
router.get("/user/", authenticateToken, checkUserActiveMiddleware, getUserById);
router.put(
  "/user/update",
  authenticateToken,
  checkUserActiveMiddleware,
  validateUpdateUser,
  handleValidationErrors,
  updateUser
);
// amazonq-ignore-next-line
router.delete(
  "/user/delete",
  authenticateToken,
  checkUserActiveMiddleware,
  deleteUser
);

router.get(
  "/users/stats",
  authenticateToken,
  checkUserActiveMiddleware,
  getUsersWithTicketStats
);

router.patch(
  "/user/:id/toggle",
  authenticateToken,
  checkUserActiveMiddleware,
  toggleUserActiveController
);

export default router;
