import type { IMovement } from "../../models/Movement";
import type { CreateCompraItemData, CreateBajaItemData } from "../repositories/IMovementRepository";

// ─── DTOs de entrada (lo que recibe el controller) ────────────────────────────

export interface CreateCompraInput {
  items: CreateCompraItemData[];
  notes?: string;
  supplier?: string;
  date?: Date;
}

export interface CreateBajaInput {
  items: CreateBajaItemData[];
  notes?: string;
  date?: Date;
}

// ─── Interfaz ──────────────────────────────────────────────────────────────────

export interface IMovementService {
  getAll(): Promise<IMovement[]>;
  getById(id: string): Promise<IMovement>;
  getByProduct(productId: string): Promise<IMovement[]>;
  createCompra(data: CreateCompraInput, userId: string): Promise<IMovement>;
  createBaja(data: CreateBajaInput, userId: string): Promise<IMovement>;
  approveBaja(id: string, approverId: string): Promise<IMovement>;
  rejectBaja(id: string, approverId: string): Promise<IMovement>;
}
