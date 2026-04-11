import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const validateCreateCategory = (req: Request, _res: Response, next: NextFunction): void => {
  const { name } = req.body as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim() === "") {
    next(new AppError("El campo 'name' es requerido y debe ser un texto no vacío", 400));
    return;
  }

  next();
};

export const validateUpdateCategory = (req: Request, _res: Response, next: NextFunction): void => {
  const body = req.body as Record<string, unknown>;

  if (Object.keys(body).length === 0) {
    next(new AppError("Debe enviar al menos un campo para actualizar", 400));
    return;
  }

  if ("name" in body && (typeof body.name !== "string" || (body.name as string).trim() === "")) {
    next(new AppError("El campo 'name' debe ser un texto no vacío", 400));
    return;
  }

  next();
};
