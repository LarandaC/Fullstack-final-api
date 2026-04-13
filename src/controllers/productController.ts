import { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { IProductService } from "../interfaces/services/IProductService";
import { IProductAccessPolicy } from "../interfaces/policies/IProductAccessPolicy";
import type { UserRole } from "../types/roles";

export class ProductController {
  constructor(
    private readonly productService: IProductService,
    private readonly accessPolicy: IProductAccessPolicy,
  ) {}

  getAll = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 10),
      );
      const result = await this.productService.getPaginated(page, limit);
      res.json(this.accessPolicy.filterResponse(result, req.user?.role));
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
      const product = await this.productService.getById(req.params.id);
      res.json(this.accessPolicy.filterResponse(product, req.user?.role));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const role = req.user?.role as UserRole;
      const body = this.accessPolicy.filterCreatePayload(req.body, role);
      const product = await this.productService.create(body);
      res.status(201).json(this.accessPolicy.filterResponse(product, role));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const role = req.user?.role as UserRole;
      const body = this.accessPolicy.filterUpdatePayload(req.body, role);
      const product = await this.productService.update(req.params.id, body);
      res.json(this.accessPolicy.filterResponse(product, role));
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.productService.delete(req.params.id);
      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  };
}
