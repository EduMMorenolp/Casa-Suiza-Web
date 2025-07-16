import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

/**
 * Obtiene todas las categorías.
 * @returns Una lista de categorías.
 */
export const findAllCategories = async () => {
  return prisma.category.findMany();
};

/**
 * Obtiene una categoría por ID.
 * @param id El ID de la categoría.
 * @returns La categoría encontrada o null si no existe.
 */
export const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

/**
 * Crea una nueva categoría.
 * @param name El nombre de la categoría.
 * @returns La nueva categoría creada.
 * @throws CustomError si la categoría ya existe (código P2002 de Prisma).
 */
export const createCategory = async (name: string) => {
  try {
    return prisma.category.create({
      data: { name },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      throw new CustomError("Ya existe una categoría con este nombre.", 409); // Conflicto
    }
    console.error("Error inesperado al crear categoría:", error);
    throw new CustomError("Error interno al crear la categoría.", 500);
  }
};

/**
 * Actualiza una categoría existente.
 * @param id El ID de la categoría a actualizar.
 * @param name El nuevo nombre de la categoría.
 * @returns La categoría actualizada.
 * @throws CustomError si la categoría no es encontrada (código P2025 de Prisma) o si el nombre ya existe (P2002).
 */
export const updateCategory = async (id: string, name: string) => {
  try {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2002") {
        throw new CustomError("Ya existe una categoría con este nombre.", 409); // Conflicto
      }
      if ((error as any).code === "P2025") {
        throw new CustomError("Categoría no encontrada para actualizar.", 404); // No encontrado
      }
    }
    console.error("Error inesperado al actualizar categoría:", error);
    throw new CustomError("Error interno al actualizar la categoría.", 500);
  }
};

/**
 * Elimina una categoría por su ID.
 * @param id El ID de la categoría a eliminar.
 * @throws CustomError si la categoría no es encontrada (código P2025 de Prisma).
 */
export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Categoría no encontrada para eliminar.", 404); // No encontrado
    }
    console.error("Error inesperado al eliminar categoría:", error);
    throw new CustomError("Error interno al eliminar la categoría.", 500);
  }
}
