import Movement, { IMovement } from "../models/Movement";
import { IMovementRepository, CreateMovementData } from "../interfaces/repositories/IMovementRepository";

export class MovementRepository implements IMovementRepository {
  async findAll(): Promise<IMovement[]> {
    return Movement.find()
      .populate("product", "name sku category")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  async findByProduct(productId: string): Promise<IMovement[]> {
    return Movement.find({ product: productId })
      .populate("product", "name sku category")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  async create(data: CreateMovementData): Promise<IMovement> {
    const movement = await Movement.create(data);
    return movement.populate("product", "name sku category");
  }
}
