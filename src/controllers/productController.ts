import { Request, Response } from "express";
import { IProductService } from "../interfaces/services/IProductService";
import { AppError } from "../errors/AppError";

export class ProductController {
  constructor(private readonly productService: IProductService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAll();
      res.json(products);
    } catch {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getById(req.params.id as string);
      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al obtener producto" });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al crear producto" });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.update(req.params.id as string, req.body);
      res.json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al actualizar producto" });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.delete(req.params.id as string);
      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  };
}
