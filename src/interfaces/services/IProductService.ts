import { IProduct } from "../../models/Product";
import { CreateProductData } from "../repositories/IProductRepository";

export interface IProductService {
  getAll(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct>;
  create(data: CreateProductData): Promise<IProduct>;
  update(id: string, data: Partial<CreateProductData>): Promise<IProduct>;
  delete(id: string): Promise<void>;
}
