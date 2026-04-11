import { IMovementService, CreateMovementInput } from "../interfaces/services/IMovementService";
import { IMovementRepository } from "../interfaces/repositories/IMovementRepository";
import { IProductRepository } from "../interfaces/repositories/IProductRepository";
import { IMovement } from "../models/Movement";
import { AppError } from "../errors/AppError";

export class MovementService implements IMovementService {
  constructor(
    private readonly movementRepository: IMovementRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async getAll(): Promise<IMovement[]> {
    return this.movementRepository.findAll();
  }

  async getByProduct(productId: string): Promise<IMovement[]> {
    return this.movementRepository.findByProduct(productId);
  }

  async create(data: CreateMovementInput, userId: string): Promise<IMovement> {
    const product = await this.productRepository.findById(data.product);
    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }

    if (data.type === "salida" && product.minStock < data.quantity) {
      throw new AppError("Stock insuficiente", 400);
    }

    const movement = await this.movementRepository.create({ ...data, user: userId });

    const stockDelta = data.type === "entrada" ? data.quantity : -data.quantity;
    await this.productRepository.updateStock(data.product, stockDelta);

    return movement;
  }
}
