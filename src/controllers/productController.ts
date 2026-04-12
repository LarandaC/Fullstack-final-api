import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { IProductService } from "../interfaces/services/IProductService";
import { AppError } from "../errors/AppError";
import { PRICE_ROLES, ROLES, type UserRole } from "../types/roles";

const PRICE_FIELDS = ["purchasePrice", "salePrice", "iva"] as const;

function canViewPrices(role: string | undefined): boolean {
  return PRICE_ROLES.includes(role as UserRole);
}

function stripPriceFields(
  product: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...product };
  for (const field of PRICE_FIELDS) {
    delete result[field];
  }
  return result;
}

function maskResponse(data: unknown, role: string | undefined): unknown {
  if (canViewPrices(role)) return data;

  const plain = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;

  if (Array.isArray(plain)) {
    return (plain as Record<string, unknown>[]).map(stripPriceFields);
  }
  return stripPriceFields(plain);
}

export class ProductController {
  constructor(private readonly productService: IProductService) {}

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string) || 10),
      );
      const result = await this.productService.getPaginated(page, limit);

      const plain = JSON.parse(JSON.stringify(result)) as {
        data: Record<string, unknown>[];
        total: number;
        pageCount: number;
      };

      if (!canViewPrices(req.user?.role)) {
        plain.data = plain.data.map(stripPriceFields);
      }

      res.json(plain);
    } catch {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  };

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getById(
        req.params.id as string,
      );
      res.json(maskResponse(product, req.user?.role));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al obtener producto" });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const role = req.user?.role as UserRole;
      let body = req.body;

      // Supervisor no puede establecer precios — se usan los valores enviados (0)
      // pero se asegura que no puedan enviar precios maliciosamente
      if (role === ROLES.SUPERVISOR) {
        body = stripPriceFields({ ...body });
        body.purchasePrice = 0;
        body.salePrice = 0;
        body.iva = 0;
      }

      const product = await this.productService.create(body);
      res.status(201).json(maskResponse(product, role));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al crear producto" });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const role = req.user?.role as UserRole;
      let body = { ...req.body };

      if (role === ROLES.SUPERVISOR) {
        // Supervisor no puede modificar campos de precio
        body = stripPriceFields(body);
      } else if (role === ROLES.FINANCIERO) {
        // Financiero solo puede modificar campos de precio
        const { purchasePrice, salePrice, iva } = body as Record<
          string,
          unknown
        >;
        body = Object.fromEntries(
          Object.entries({ purchasePrice, salePrice, iva }).filter(
            ([, v]) => v !== undefined,
          ),
        );
      }

      const product = await this.productService.update(
        req.params.id as string,
        body,
      );
      res.json(maskResponse(product, role));
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error al actualizar producto" });
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
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
