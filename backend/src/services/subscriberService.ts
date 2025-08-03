import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

// Crear un nuevo suscriptor
export const createSubscriber = async (
  subMail: string,
  subPhone?: string | null
) => {
  try {
    const existingSubscriber = await prisma.subscriber.findFirst({
      where: {
        OR: [subMail ? { subMail } : {}, subPhone ? { subPhone } : {}],
      },
    });

    if (existingSubscriber) {
      throw new CustomError(
        "Ya existe un suscriptor con ese email o teléfono",
        400
      );
    }

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
    // Validate and sanitize input
    if (!Number.isInteger(id) || id <= 0) {
      throw new CustomError("ID de suscriptor inválido.", 400);
    }

    const updateData: { subMail?: string; subPhone?: string | null } = {};
    if (data.subMail !== undefined) updateData.subMail = data.subMail;
    if (data.subPhone !== undefined) updateData.subPhone = data.subPhone;

    return prisma.subscriber.update({
      where: { id },
      data: updateData,
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
    if (!Number.isInteger(id) || id <= 0) {
      throw new CustomError("ID de suscriptor inválido.", 400);
    }
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
