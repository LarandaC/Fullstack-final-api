import Product, { IProduct } from "../models/Product";
import { IProductRepository, CreateProductData } from "../interfaces/repositories/IProductRepository";

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<IProduct[]> {
    return Product.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku });
  }

  async create(data: CreateProductData): Promise<IProduct> {
    return Product.create(data);
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  }

  async updateStock(id: string, delta: number): Promise<void> {
    await Product.findByIdAndUpdate(id, { $inc: { stock: delta } });
  }
}
