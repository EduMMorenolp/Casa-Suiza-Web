import { Request, Response, NextFunction } from "express";
import * as couponService from "../services/couponService";
import { CustomError } from "../utils/CustomError";

// Crear un nuevo cupón
export async function createCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, discount, isPercentage, expiresAt, maxUses, eventId } =
      req.body;

    if (!code || discount === undefined || !eventId) {
      throw new CustomError(
        "Faltan datos requeridos para crear el cupón (código, descuento, ID de evento).",
        400
      );
    }
    if (typeof discount !== "number" || discount < 0) {
      throw new CustomError("El descuento debe ser un número positivo.", 400);
    }
    if (isPercentage !== undefined && typeof isPercentage !== "boolean") {
      throw new CustomError("isPercentage debe ser un valor booleano.", 400);
    }
    if (expiresAt && isNaN(new Date(expiresAt).getTime())) {
      throw new CustomError("Fecha de expiración inválida.", 400);
    }

    const newCoupon = await couponService.createCoupon({
      code,
      discount,
      isPercentage,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxUses,
      eventId,
    });
    res.status(201).json(newCoupon);
  } catch (error) {
    next(error);
  }
}

// Obtener todos los cupones
export async function getAllCoupons(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const coupons = await couponService.findAllCoupons();
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
}

// Obtener un cupón por ID
export async function getCouponById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const coupon = await couponService.findCouponById(id);
    if (!coupon) {
      throw new CustomError("Cupón no encontrado.", 404);
    }
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
}

// Actualizar un cupón existente
export async function updateCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { code, discount, isPercentage, expiresAt, maxUses, eventId } =
      req.body;

    if (
      !code &&
      discount === undefined &&
      isPercentage === undefined &&
      expiresAt === undefined &&
      maxUses === undefined &&
      eventId === undefined
    ) {
      throw new CustomError(
        "Se requiere al menos un campo para actualizar el cupón.",
        400
      );
    }
    if (
      discount !== undefined &&
      (typeof discount !== "number" || discount < 0)
    ) {
      throw new CustomError("El descuento debe ser un número positivo.", 400);
    }
    if (isPercentage !== undefined && typeof isPercentage !== "boolean") {
      throw new CustomError("isPercentage debe ser un valor booleano.", 400);
    }
    if (expiresAt && isNaN(new Date(expiresAt).getTime())) {
      throw new CustomError("Fecha de expiración inválida.", 400);
    }

    const updatedCoupon = await couponService.updateCoupon(id, {
      code,
      discount,
      isPercentage,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : expiresAt === null
        ? null
        : undefined, // Permite actualizar a null
      maxUses,
      eventId,
    });
    res.status(200).json(updatedCoupon);
  } catch (error) {
    next(error);
  }
}

// Eliminar un cupón
export async function deleteCoupon(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await couponService.deleteCoupon(id);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
}
