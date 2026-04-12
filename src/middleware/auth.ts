import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../types/roles";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No autorizado, token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};

/**
 * Middleware factory para control de acceso basado en roles.
 * Acepta uno o más roles permitidos.
 *
 * @example
 * router.delete("/:id", protect, requireRole(ROLES.ADMIN), controller.delete)
 * router.put("/:id", protect, requireRole(ROLES.ADMIN, ROLES.SUPERVISOR), controller.update)
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
      return;
    }
    next();
  };
