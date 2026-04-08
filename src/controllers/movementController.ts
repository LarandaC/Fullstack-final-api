import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { IMovementService } from "../interfaces/services/IMovementService";
import { AppError } from "../errors/AppError";

export class MovementController {
  constructor(private readonly movementService: IMovementService) {}

  getAll = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const movements = await this.movementService.getAll();
      res.json(movements);
    } catch {
      res.status(500).json({ message: "Error al obtener movimientos" });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const movement = await this.movementService.create(req.body, req.user!.id);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al crear movimiento" });
    }
  };

  getByProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const movements = await this.movementService.getByProduct(req.params.productId as string);
      res.json(movements);
    } catch {
      res.status(500).json({ message: "Error al obtener movimientos" });
    }
  };
}
