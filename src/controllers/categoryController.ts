import { Request, Response, NextFunction } from "express";
import { ICategoryService } from "../interfaces/services/ICategoryService";

export class CategoryController {
  constructor(private readonly categoryService: ICategoryService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.getById(req.params.id as string);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.update(req.params.id as string, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.delete(req.params.id as string);
      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  };
}
