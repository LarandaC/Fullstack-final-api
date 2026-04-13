import { Request, Response, NextFunction } from "express";
import { ROLES } from "../types/roles";

const VALID_ROLES = Object.values(ROLES);

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ message: "El nombre es requerido" });
    return;
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    res.status(400).json({ message: "El email es requerido" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ message: "El email no es válido" });
    return;
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    return;
  }

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    res
      .status(400)
      .json({ message: `El rol debe ser uno de: ${VALID_ROLES.join(", ")}` });
    return;
  }

  next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, password, role } = req.body;
  const hasAnyField = [name, email, password, role].some(
    (v) => v !== undefined,
  );

  if (!hasAnyField) {
    res
      .status(400)
      .json({ message: "Se debe enviar al menos un campo para actualizar" });
    return;
  }

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    res.status(400).json({ message: "El nombre no puede estar vacío" });
    return;
  }

  if (email !== undefined) {
    if (typeof email !== "string" || email.trim() === "") {
      res.status(400).json({ message: "El email no puede estar vacío" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ message: "El email no es válido" });
      return;
    }
  }

  if (password !== undefined && (typeof password !== "string" || password.length < 6)) {
    res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    return;
  }

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    res
      .status(400)
      .json({ message: `El rol debe ser uno de: ${VALID_ROLES.join(", ")}` });
    return;
  }

  next();
};
