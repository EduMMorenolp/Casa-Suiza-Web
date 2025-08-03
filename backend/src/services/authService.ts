// ./src/services/authService.js

import { getUserByEmail, getUserByUsername } from "../repositories/userRepository";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../repositories/authRepository";
// Importa las funciones de cifrado y comparación de contraseñas
import { comparePassword, hashPassword } from "../utils/bcrypt";
// Importa la clase de error personalizado
import { CustomError } from "../utils/CustomError";
// Importa la función para generar el token JWT
import { generateAuthToken } from "../utils/jwt";

/**
 * Crear un nuevo usuario
 * @param username
 * @param email
 * @param password
 * @returns
 */
export const createUserService = async (
  username: string,
  email: string,
  password: string
) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new CustomError("El correo electrónico ya está en uso", 409);
  }
  const hashedPassword = await hashPassword(password);
  return await createUser(username, email, hashedPassword);
};

/**
 * Iniciar sesión de un usuario
 * @param username
 * @param password
 * @returns
 */
export const loginUserService = async (username: string, password: string) => {
  const user = await getUserByUsername(username);
  if (!user || user.isDeleted) {
    throw new CustomError(
      "Por favor, verifica tu nombre de usuario y tu contraseña e intenta nuevamente.",
      401
    );
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new CustomError(
      "Por favor, verifica tu nombre de usuario y tu contraseña e intenta nuevamente.",
      401
    );
  }
  // Generación del token JWT
  const token = await generateAuthTokenForUser(user.id, user.role);
  const userState = await loginUser(user.email);
  return { token, user };
};

export const logoutUserService = async (userId: string) => {
  const state = false;
  const success = await logoutUser(userId);
  if (!success) {
    throw new CustomError(
      "Parece que hubo un problema al intentar cerrar sesión. Esto puede deberse a que tu cuenta ya estaba inactiva o no existe en nuestro sistema.",
      404
    );
  }
  return true;
};

/**
 * Generar el token JWT (ya no es necesario redefinir la función)
 * @param userId
 * @param role
 * @returns
 */
export const generateAuthTokenForUser = (userId: string, role: string) => {
  return generateAuthToken(userId, role);
};
