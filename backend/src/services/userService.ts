// ./src/services/userService.js

import {
  deleteUser,
  getUserById,
  updateUser,
  getUsersWithTicketStats,
  toggleUserActive,
} from "../repositories/userRepository";
import { hashPassword } from "../utils/bcrypt";
import { CustomError } from "../utils/CustomError";

/**
 * Obtener usuario por ID
 * @param id
 * @returns
 */
export const getUserByIdService = async (id: string) => {
  const user = await getUserById(id);
  if (!user) {
    throw new CustomError("El usuario no existe.", 404);
  }
  return user;
};

/**
 * Actualizar usuario
 * @param id
 * @param username
 * @param email
 * @param password
 * @returns
 */
export const updateUserService = async (
  id: string,
  username?: string,
  email?: string,
  password?: string
) => {
  await getUserByIdService(id);

  let passwordHash = undefined;
  if (password) {
    passwordHash = await hashPassword(password);
  }
  await updateUser(id, username, email, passwordHash);
  const updatedUser = {
    id: id,
    username: username,
    email: email,
    password: password,
  };
  return updatedUser;
};

/**
 * Eliminar usuario
 * @param id
 * @returns
 */
export const deleteUserService = async (id: string) => {
  await getUserByIdService(id);
  return await deleteUser(id);
};

/**
 * Obtener usuarios con estadísticas de tickets
 * @returns
 */
export const getUsersWithTicketStatsService = async () => {
  return await getUsersWithTicketStats();
};

export const toggleUserActiveService = async (id: string, isActive: boolean) => {
  return await toggleUserActive(id, isActive);
};
