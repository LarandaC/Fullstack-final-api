import { IMovement } from "../../models/Movement";

export interface CreateMovementInput {
  type: "entrada" | "salida";
  quantity: number;
  product: string;
  supplier?: string;
  reason?: string;
  date?: Date;
}

export interface IMovementService {
  getAll(): Promise<IMovement[]>;
  getByProduct(productId: string): Promise<IMovement[]>;
  create(data: CreateMovementInput, userId: string): Promise<IMovement>;
}
