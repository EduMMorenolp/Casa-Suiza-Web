// @ts-ignore
import { body } from "express-validator";

export const subscriberValidationRules = {
  create: [
    body("subMail")
      .notEmpty()
      .withMessage("El correo electrónico es obligatorio para la suscripción.")
      .isEmail()
      .withMessage(
        "Por favor, proporciona una dirección de correo electrónico válida."
      )
      .normalizeEmail(),
    body("subPhone")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("El número de teléfono debe ser una cadena de texto.")
      .trim(),
  ],
  update: [
    body("subMail")
      .optional()
      .isEmail()
      .withMessage(
        "Por favor, proporciona una dirección de correo electrónico válida."
      )
      .normalizeEmail(),
    body("subPhone")
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage("El número de teléfono debe ser una cadena de texto.")
      .trim(),
  ],
};
