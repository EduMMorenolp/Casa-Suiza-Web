import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService";
import { CustomError } from "../utils/CustomError";

// Obtener todas las categorías
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoryService.findAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const category = await categoryService.findCategoryById(id);
    if (!category) {
      throw new CustomError("Categoría no encontrada.", 404);
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

function validateCategoryName(name: string): void {
  if (!name || typeof name !== "string" || name.trim() === "") {
    throw new CustomError(
      "El nombre de la categoría es obligatorio y debe ser una cadena de texto válida.",
      400
    );
  }
}

// Crear una nueva categoría
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    validateCategoryName(name);
    const newCategory = await categoryService.createCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoría existente
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    validateCategoryName(name);
    const updatedCategory = await categoryService.updateCategory(id, name);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Eliminar una categoría
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
