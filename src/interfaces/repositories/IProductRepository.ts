import { IProduct } from "../../models/Product";

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  category: string;
}

export interface IProductRepository {
  findAll(): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  findBySku(sku: string): Promise<IProduct | null>;
  create(data: CreateProductData): Promise<IProduct>;
  update(id: string, data: Partial<CreateProductData>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
  updateStock(id: string, delta: number): Promise<void>;
}
