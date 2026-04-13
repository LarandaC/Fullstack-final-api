import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../interfaces/services/IAuthService";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({ message: "Usuario creado correctamente", ...result });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
