import prisma from "../config/prismaClient";
import { CustomError } from "../utils/CustomError";

interface CouponData {
  code: string;
  discount: number;
  isPercentage?: boolean;
  expiresAt?: Date | null;
  maxUses?: number | null;
  eventId: string;
}

/**
 * Crea un nuevo cupón.
 * @param data Los datos del cupón.
 * @returns El cupón creado.
 * @throws CustomError si el código ya existe o el evento no es encontrado.
 */
export async function createCoupon(data: CouponData) {
  try {
    // Verificar que el evento exista
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });
    if (!event) {
      throw new CustomError("Evento asociado al cupón no encontrado.", 404);
    }

    return prisma.coupon.create({
      data: {
        code: data.code,
        discount: data.discount,
        isPercentage: data.isPercentage,
        expiresAt: data.expiresAt,
        maxUses: data.maxUses,
        eventId: data.eventId,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new CustomError("El código de cupón ya existe.", 409); // Conflict
    }
    throw error;
  }
}

/**
 * Obtiene todos los cupones.
 * @returns Una lista de cupones.
 */
export async function findAllCoupons() {
  try {
    return prisma.coupon.findMany();
  } catch (error: unknown) {
    throw new CustomError("Error al obtener cupones.", 500);
  }
}

/**
 * Obtiene un cupón por su ID.
 * @param id El ID del cupón.
 * @returns El cupón encontrado o null si no existe.
 */
export async function findCouponById(id: string) {
  try {
    return prisma.coupon.findUnique({
      where: { id },
    });
  } catch (error: unknown) {
    throw new CustomError("Error al obtener cupón.", 500);
  }
}

/**
 * Obtiene un cupón por su código.
 * @param code El código del cupón.
 * @returns El cupón encontrado o null si no existe.
 */
export async function findCouponByCode(code: string) {
  return prisma.coupon.findUnique({
    where: { code },
  });
}

/**
 * Actualiza los datos de un cupón existente.
 * @param id El ID del cupón a actualizar.
 * @param data Los datos a actualizar del cupón.
 * @returns El cupón actualizado.
 * @throws CustomError si el cupón no es encontrado o el código ya existe.
 */
export async function updateCoupon(id: string, data: Partial<CouponData>) {
  try {
    if (!id || typeof id !== 'string') {
      throw new CustomError("ID de cupón inválido.", 400);
    }
    
    const updateData: Partial<CouponData> = {};
    if (data.code !== undefined) updateData.code = data.code;
    if (data.discount !== undefined) updateData.discount = data.discount;
    if (data.isPercentage !== undefined) updateData.isPercentage = data.isPercentage;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
    if (data.maxUses !== undefined) updateData.maxUses = data.maxUses;
    if (data.eventId !== undefined) updateData.eventId = data.eventId;
    
    return await prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if ((error as any).code === "P2002") {
        throw new CustomError("El código de cupón ya existe.", 409);
      }
      if ((error as any).code === "P2025") {
        throw new CustomError("Cupón no encontrado para actualizar.", 404);
      }
    }
    throw error;
  }
}

/**
 * Elimina un cupón por su ID.
 * @param id El ID del cupón a eliminar.
 * @throws CustomError si el cupón no es encontrado.
 */
export async function deleteCoupon(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      throw new CustomError("ID de cupón inválido.", 400);
    }
    await prisma.coupon.delete({
      where: { id },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === "P2025"
    ) {
      throw new CustomError("Cupón no encontrado para eliminar.", 404);
    }
    throw error;
  }
}
