import type { ICategory } from "../../models/Category";

export interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  findById(id: string): Promise<ICategory | null>;
  findByName(name: string): Promise<ICategory | null>;
  create(data: CreateCategoryData): Promise<ICategory>;
  update(id: string, data: Partial<CreateCategoryData>): Promise<ICategory | null>;
  delete(id: string): Promise<ICategory | null>;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}
