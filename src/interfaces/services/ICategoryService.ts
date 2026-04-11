import type { ICategory } from "../../models/Category";
import type { CreateCategoryData } from "../repositories/ICategoryRepository";

export interface ICategoryService {
  getAll(): Promise<ICategory[]>;
  getById(id: string): Promise<ICategory>;
  create(data: CreateCategoryData): Promise<ICategory>;
  update(id: string, data: Partial<CreateCategoryData>): Promise<ICategory>;
  delete(id: string): Promise<void>;
}
