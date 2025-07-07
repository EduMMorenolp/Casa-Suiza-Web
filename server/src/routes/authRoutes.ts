// src/routes/authRoutes.ts

import express from "express";
import {
  registerUser,
  loginUserController,
  logoutUserController,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authTokenMiddleware";

import {
  validateUserLogin,
  validateUserRegister,
} from "../validation/authValidate";

import { handleValidationErrors } from "../middleware/errorHandler";

// Middlewares
const router = express.Router();

/**
 * Rutas de autenticación
 */
router.post(
  "/auth/register",
  validateUserRegister,
  handleValidationErrors,
  registerUser
);
router.post(
  "/auth/login",
  validateUserLogin,
  handleValidationErrors,
  loginUserController
);
router.post("/auth/logout", authenticateToken, logoutUserController);

export default router;
