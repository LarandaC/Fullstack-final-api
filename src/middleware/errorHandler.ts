import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "campo";
    res.status(409).json({ message: `Ya existe un registro con ese ${field}` });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};
