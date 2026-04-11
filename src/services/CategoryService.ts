import type { ICategoryService } from "../interfaces/services/ICategoryService";
import type { ICategoryRepository, CreateCategoryData } from "../interfaces/repositories/ICategoryRepository";
import type { IProductRepository } from "../interfaces/repositories/IProductRepository";
import type { ICategory } from "../models/Category";
import { AppError } from "../errors/AppError";

export class CategoryService implements ICategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async getAll(): Promise<ICategory[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Categoría no encontrada", 404);
    }
    return category;
  }

  async create(data: CreateCategoryData): Promise<ICategory> {
    const existing = await this.categoryRepository.findByName(data.name);
    if (existing) {
      throw new AppError("Ya existe una categoría con ese nombre", 409);
    }
    return this.categoryRepository.create(data);
  }

  async update(id: string, data: Partial<CreateCategoryData>): Promise<ICategory> {
    const category = await this.categoryRepository.update(id, data);
    if (!category) {
      throw new AppError("Categoría no encontrada", 404);
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const productCount = await this.productRepository.countByCategory(id);
    if (productCount > 0) {
      throw new AppError(
        `No se puede eliminar la categoría porque tiene ${productCount} producto(s) asociado(s)`,
        409,
      );
    }

    const category = await this.categoryRepository.delete(id);
    if (!category) {
      throw new AppError("Categoría no encontrada", 404);
    }
  }
}
