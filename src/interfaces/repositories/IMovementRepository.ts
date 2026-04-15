import { BajaReason, IMovement, MovementStatus } from "../../models/Movement";
import type { MovementFilters } from "../../utils/FilterUtils";

export interface CreateCompraItemData {
  product: string;
  quantity: number;
  purchasePrice?: number;
  salePrice?: number;
}

export interface CreateBajaItemData {
  product: string;
  quantity: number;
  reason: BajaReason;
  reasonDetail?: string;
}

export interface CreateCompraData {
  items: CreateCompraItemData[];
  notes?: string;
  supplier?: string;
  createdBy: string;
  date?: Date;
}

export interface CreateBajaData {
  items: CreateBajaItemData[];
  notes?: string;
  createdBy: string;
  date?: Date;
}

export interface IMovementRepository {
  findAll(filters?: MovementFilters): Promise<IMovement[]>;
  findById(id: string): Promise<IMovement | null>;
  findByProduct(productId: string): Promise<IMovement[]>;
  createCompra(data: CreateCompraData): Promise<IMovement>;
  createBaja(data: CreateBajaData): Promise<IMovement>;
  updateStatus(
    id: string,
    status: MovementStatus,
    approverId: string,
  ): Promise<IMovement | null>;
}
