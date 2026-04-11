import { IProductService } from "../interfaces/services/IProductService";
import { IProductRepository, CreateProductData, PaginatedResult } from "../interfaces/repositories/IProductRepository";
import { IProduct } from "../models/Product";
import { AppError } from "../errors/AppError";

export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getPaginated(page: number, limit: number): Promise<PaginatedResult<IProduct>> {
    return this.productRepository.findPaginated(page, limit);
  }

  async getAll(): Promise<IProduct[]> {
    return this.productRepository.findAll();
  }

  async getById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }
    return product;
  }

  async create(data: CreateProductData): Promise<IProduct> {
    const existing = await this.productRepository.findBySku(data.sku);
    if (existing) {
      throw new AppError("El SKU ya existe", 409);
    }
    if (data.isWeighable) {
      data.unit = "kg";
    }
    return this.productRepository.create(data);
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<IProduct> {
    if (data.isWeighable) {
      data.unit = "kg";
    }
    const product = await this.productRepository.update(id, data);
    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }
    return product;
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.delete(id);
    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }
  }
}
