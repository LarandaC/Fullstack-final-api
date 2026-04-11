import { IProduct } from "../../models/Product";
import { CreateProductData, PaginatedResult } from "../repositories/IProductRepository";

export interface IProductService {
  getPaginated(page: number, limit: number): Promise<PaginatedResult<IProduct>>;
  getAll(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct>;
  create(data: CreateProductData): Promise<IProduct>;
  update(id: string, data: Partial<CreateProductData>): Promise<IProduct>;
  delete(id: string): Promise<void>;
}
