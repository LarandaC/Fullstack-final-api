import { IMovement } from "../../models/Movement";

export interface CreateMovementData {
  type: "entrada" | "salida";
  quantity: number;
  product: string;
  user: string;
  supplier?: string;
  reason?: string;
  date?: Date;
}

export interface IMovementRepository {
  findAll(): Promise<IMovement[]>;
  findByProduct(productId: string): Promise<IMovement[]>;
  create(data: CreateMovementData): Promise<IMovement>;
}
