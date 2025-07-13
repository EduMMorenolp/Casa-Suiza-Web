import { Request, Response, NextFunction } from "express";
import * as subscriberService from "../services/subscriberService";
import { CustomError } from "../utils/CustomError";

// Crear un nuevo suscriptor
export const createSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subMail, subPhone } = req.body;
    if (!subMail) {
      throw new CustomError(
        "El correo electrónico del suscriptor es obligatorio.",
        400
      );
    }
    const newSubscriber = await subscriberService.createSubscriber(
      subMail,
      subPhone
    );
    res.status(201).json(newSubscriber);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los suscriptores
export const getAllSubscribers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscribers = await subscriberService.findAllSubscribers();
    res.status(200).json(subscribers);
  } catch (error) {
    next(error);
  }
};

// Obtener un suscriptor por ID
export const getSubscriberById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const subscriber = await subscriberService.findSubscriberById(Number(id));
    if (!subscriber) {
      throw new CustomError("Suscriptor no encontrado.", 404);
    }
    res.status(200).json(subscriber);
  } catch (error) {
    next(error);
  }
};

// Actualizar un suscriptor existente
export const updateSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { subMail, subPhone } = req.body;
    if (!subMail && !subPhone) {
      throw new CustomError(
        "Se requiere al menos un campo (correo electrónico o teléfono) para la actualización.",
        400
      );
    }
    const updatedSubscriber = await subscriberService.updateSubscriber(
      Number(id),
      { subMail, subPhone }
    );
    if (!updatedSubscriber) {
      throw new CustomError(
        "Suscriptor no encontrado o no pudo ser actualizado.",
        404
      );
    }
    res.status(200).json(updatedSubscriber);
  } catch (error) {
    next(error);
  }
};

// Eliminar un suscriptor
export const deleteSubscriber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await subscriberService.deleteSubscriber(Number(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
