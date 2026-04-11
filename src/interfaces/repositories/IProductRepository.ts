import mongoose from "mongoose";
import { IProduct, UnitType } from "../../models/Product";

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string | mongoose.Types.ObjectId;
  purchasePrice: number;
  salePrice: number;
  image?: string;
  isWeighable?: boolean;
  unit: UnitType;
  iva: number;
  minStock?: number;
  maxStock?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface IProductRepository {
  findPaginated(page: number, limit: number): Promise<PaginatedResult<IProduct>>;
  findAll(): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | null>;
  findBySku(sku: string): Promise<IProduct | null>;
  create(data: CreateProductData): Promise<IProduct>;
  update(id: string, data: Partial<CreateProductData>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
  updateStock(id: string, delta: number): Promise<void>;
  countByCategory(categoryId: string): Promise<number>;
}
