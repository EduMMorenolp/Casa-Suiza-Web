// ./src/repositories/userRepository.js

import exp from "constants";
import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

/**
 * Verificar si el usuario está activo
 * @param userId
 * @returns
 */
export const checkUserActive = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });
    return user ? user.isActive : false;
  } catch (error: any) {
    console.error(
      "❌ Error al verificar usuario activo:",
      error?.message || "Error desconocido"
    );
    throw new CustomError("Error al verificar estado del usuario", 500);
  }
};

/**
 * Obtener email de Usuario
 * @param email
 * @returns
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error: any) {
    console.error("❌ Error al obtener el usuario por email:", error.message);
    throw new CustomError("Error al buscar el usuario", 500);
  }
};

/**
 * Obtener usuario por username
 * @param username
 * @returns
 */
export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  } catch (error: any) {
    console.error("❌ Error al obtener el usuario por username:", error.message);
    throw new CustomError("Error al buscar el usuario", 500);
  }
};

/**
 * Obtener todos los usuarios
 * @returns
 */
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        role: true,
        isDeleted: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error: any) {
    console.error("❌ Error al obtener los usuarios:", error.message);
    throw new CustomError("Error al obtener usuarios", 500);
  }
};

/**
 * Obtener usuario por ID
 * @param id
 * @returns
 */
export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? user : null;
  } catch (error: any) {
    console.error("❌ Error al obtener usuario:", error.message);
    throw new CustomError("Error al obtener usuario", 500);
  }
};

/**
 * Buscar usuarios con filtros
 */
export const searchUsers = async (filters: any) => {
  try {
    const { username, email, role, isActive } = filters;
    const whereClause: any = {};

    if (username && typeof username === "string") {
      whereClause.username = { contains: username };
    }
    if (email && typeof email === "string") {
      whereClause.email = { contains: email };
    }
    if (role && typeof role === "string") {
      whereClause.role = role;
    }
    if (isActive !== undefined && typeof isActive === "boolean") {
      whereClause.isActive = isActive;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
    });
    return users;
  } catch (error: any) {
    console.error("❌ Error al obtener usuario:", error.message);
    throw new CustomError("Error al obtener usuario", 500);
  }
};

/**
 * Actualizar usuario
 * @param id
 * @param username
 * @param email
 * @param passwordHash
 * @returns
 */
export const updateUser = async (
  id: string,
  username?: string,
  email?: string,
  passwordHash?: string,
  role?: string
) => {
  try {
    const dataToUpdate: any = {};
    if (username) {
      dataToUpdate.username = username;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    if (passwordHash) {
      dataToUpdate.password = passwordHash;
    }
    if (role) {
      dataToUpdate.role = role;
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    return updatedUser;
  } catch (error: any) {
    console.error("❌ Error al actualizar usuario:", error.message);
    if (error.code === "P2025")
      throw new CustomError("Usuario no encontrado", 404);
    throw new CustomError("Error al actualizar usuario", 500);
  }
};

/**
 * Eliminar usuario
 * @param id
 * @returns
 */
export const deleteUser = async (id: string) => {
  try {
    const deletedUser = await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
    return deletedUser ? true : false;
  } catch (error: any) {
    console.error("❌ Error al eliminar usuario:", error.message);
    throw new CustomError("Error al eliminar usuario", 500);
  }
};

/**
 * Restaurar usuario
 * @param id
 * @returns
 */
export const restoreUser = async (id: string) => {
  try {
    if (!id || typeof id !== "string") {
      throw new CustomError("ID de usuario inválido", 400);
    }
    const restoredUser = await prisma.user.update({
      where: { id },
      data: { isDeleted: false },
    });
    return restoredUser;
  } catch (error: any) {
    console.error("❌ Error al restaurar usuario:", error.message);
    throw new CustomError("Error al restaurar usuario", 500);
  }
};

/**
 * Obtener todos los usuarios
 * @returns
 */
export const getUsersWithTicketStats = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.message);
    throw new CustomError("Error al obtener usuarios", 500);
  }
};

export const toggleUserActive = async (id: string, isActive: boolean) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive }
    });
    return updatedUser;
  } catch (error: any) {
    console.error("❌ Error al cambiar estado del usuario:", error.message);
    throw new CustomError("Error al cambiar estado del usuario", 500);
  }
};
