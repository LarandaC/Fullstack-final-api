import Category, { ICategory } from "../models/Category";
import type { ICategoryRepository, CreateCategoryData } from "../interfaces/repositories/ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<ICategory[]> {
    return Category.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  }

  async findByName(name: string): Promise<ICategory | null> {
    return Category.findOne({ name });
  }

  async create(data: CreateCategoryData): Promise<ICategory> {
    return Category.create(data);
  }

  async update(id: string, data: Partial<CreateCategoryData>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  }
}
