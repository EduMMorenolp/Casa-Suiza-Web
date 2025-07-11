import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

// Crear un nuevo suscriptor
export const createSubscriber = async (
  subMail: string,
  subPhone?: string | null
) => {
  try {
    return prisma.subscriber.create({
      data: {
        subMail,
        subPhone,
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (
        (error as any).code === "P2002" &&
        (error as any).meta?.target?.includes("sub_email")
      ) {
        throw new CustomError("Este correo electrónico ya está suscrito.", 409);
      }
    }
    throw error;
  }
};

// Obtener todos los suscriptores
export const findAllSubscribers = async () => {
  return prisma.subscriber.findMany();
};

// Obtener un suscriptor por ID
export const findSubscriberById = async (id: number) => {
  return prisma.subscriber.findUnique({
    where: { id },
  });
};

// Actualizar un suscriptor existente
export const updateSubscriber = async (
  id: number,
  data: { subMail?: string; subPhone?: string | null }
) => {
  try {
    return prisma.subscriber.update({
      where: { id },
      data: {
        subMail: data.subMail,
        subPhone: data.subPhone,
      },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (
        (error as any).code === "P2002" &&
        (error as any).meta?.target?.includes("sub_email")
      ) {
        throw new CustomError(
          "Este correo electrónico ya está suscrito a otra entrada.",
          409
        );
      }
      if ((error as any).code === "P2025") {
        throw new CustomError("Suscriptor no encontrado.", 404);
      }
      throw error;
    }
  }
};

// Eliminar un suscriptor
export const deleteSubscriber = async (id: number) => {
  try {
    await prisma.subscriber.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2025") {
        throw new CustomError("Suscriptor no encontrado.", 404);
      }
    }
    throw error;
  }
};