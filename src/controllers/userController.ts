import { Response, NextFunction } from "express";
import type { IUserService } from "../interfaces/services/IUserService";
import type { AuthRequest } from "../middleware/auth";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role, hasMovements } = req.query;
      const users = await this.userService.getAll({
        role: role as string,
        hasMovements: hasMovements === "true",
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getById(req.params.id as string);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requesterId = req.user!.id;
      const user = await this.userService.update(
        req.params.id as string,
        req.body,
        requesterId,
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requesterId = req.user!.id;
      await this.userService.delete(req.params.id as string, requesterId);
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
}
