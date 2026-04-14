import { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import type { IMovementService } from "../interfaces/services/IMovementService";

export class MovementController {
  constructor(private readonly movementService: IMovementService) {}

  getAll = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movements = await this.movementService.getAll();
      res.json(movements);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movement = await this.movementService.getById(
        req.params.id as string,
      );
      res.json(movement);
    } catch (error) {
      next(error);
    }
  };

  getByProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movements = await this.movementService.getByProduct(
        req.params.productId as string,
      );
      res.json(movements);
    } catch (error) {
      next(error);
    }
  };

  createCompra = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movement = await this.movementService.createCompra(
        req.body,
        req.user!.id,
      );
      res.status(201).json(movement);
    } catch (error) {
      next(error);
    }
  };

  createBaja = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movement = await this.movementService.createBaja(
        req.body,
        req.user!.id,
      );
      res.status(201).json(movement);
    } catch (error) {
      next(error);
    }
  };

  approveBaja = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movement = await this.movementService.approveBaja(
        req.params.id as string,
        req.user!.id,
      );
      res.json(movement);
    } catch (error) {
      next(error);
    }
  };

  rejectBaja = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const movement = await this.movementService.rejectBaja(
        req.params.id as string,
        req.user!.id,
      );
      res.json(movement);
    } catch (error) {
      next(error);
    }
  };
}
