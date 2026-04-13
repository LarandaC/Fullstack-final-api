import Product, { IProduct } from "../models/Product";
import { IProductRepository, CreateProductData, PaginatedResult } from "../interfaces/repositories/IProductRepository";

export class ProductRepository implements IProductRepository {
  async findPaginated(page: number, limit: number): Promise<PaginatedResult<IProduct>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Product.find().populate("category").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);
    return { data, total, page, limit, pageCount: Math.ceil(total / limit) };
  }

  async findAll(): Promise<IProduct[]> {
    return Product.find().populate("category").sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate("category");
  }

  async findBySku(sku: string): Promise<IProduct | null> {
    return Product.findOne({ sku }).populate("category");
  }

  async create(data: CreateProductData): Promise<IProduct> {
    const product = await Product.create(data);
    return product.populate("category");
  }

  async update(id: string, data: Partial<CreateProductData>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate("category");
  }

  async delete(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  }

  async updateStock(id: string, delta: number): Promise<void> {
    await Product.findByIdAndUpdate(id, { $inc: { stock: delta } });
  }

  async countByCategory(categoryId: string): Promise<number> {
    return Product.countDocuments({ category: categoryId });
  }
}
