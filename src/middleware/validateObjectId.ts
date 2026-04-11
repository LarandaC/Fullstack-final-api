import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../errors/AppError";

export const validateObjectId = (req: Request, _res: Response, next: NextFunction): void => {
  if (!isValidObjectId(req.params.id)) {
    next(new AppError("El ID proporcionado no es válido", 400));
    return;
  }
  next();
};
