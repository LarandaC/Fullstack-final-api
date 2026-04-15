import type {
  IMovementService,
  CreateCompraInput,
  CreateBajaInput,
} from "../interfaces/services/IMovementService";
import type { IMovementRepository } from "../interfaces/repositories/IMovementRepository";
import type { IStockService } from "../interfaces/services/IStockService";
import type { IMovement } from "../models/Movement";
import { AppError } from "../errors/AppError";
import { type MovementFilters } from "../utils/FilterUtils";

export class MovementService implements IMovementService {
  constructor(
    private readonly movementRepository: IMovementRepository,
    private readonly stockService: IStockService,
  ) {}

  async getAll(filters?: MovementFilters): Promise<IMovement[]> {
    return this.movementRepository.findAll(filters);
  }

  async getById(id: string): Promise<IMovement> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) throw new AppError("Movimiento no encontrado", 404);
    return movement;
  }

  async getByProduct(productId: string): Promise<IMovement[]> {
    return this.movementRepository.findByProduct(productId);
  }

  async createCompra(
    data: CreateCompraInput,
    userId: string,
  ): Promise<IMovement> {
    await Promise.all(
      data.items.map((item) => this.stockService.validateExists(item.product)),
    );

    const movement = await this.movementRepository.createCompra({
      ...data,
      createdBy: userId,
    });

    await Promise.all(
      data.items.map(async (item) => {
        await this.stockService.increase(item.product, item.quantity);
        await this.stockService.updatePrices(item.product, {
          purchasePrice: item.purchasePrice,
          salePrice: item.salePrice,
        });
      }),
    );

    return movement;
  }

  async createBaja(data: CreateBajaInput, userId: string): Promise<IMovement> {
    await Promise.all(
      data.items.map((item) =>
        this.stockService.validateSufficientStock(item.product, item.quantity),
      ),
    );

    return this.movementRepository.createBaja({ ...data, createdBy: userId });
  }

  async approveBaja(id: string, approverId: string): Promise<IMovement> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) throw new AppError("Movimiento no encontrado", 404);
    if (movement.type !== "baja")
      throw new AppError("Solo se pueden aprobar movimientos de baja", 400);
    if (movement.status !== "pendiente")
      throw new AppError(`El movimiento ya fue ${movement.status}`, 409);

    const getProductId = (product: unknown): string => {
      if (product && typeof product === "object" && "_id" in product) {
        return String((product as { _id: unknown })._id);
      }
      return String(product);
    };

    // Re-validar stock al momento de aprobación
    await Promise.all(
      movement.items.map((item) =>
        this.stockService.validateSufficientStock(
          getProductId(item.product),
          item.quantity,
        ),
      ),
    );

    await Promise.all(
      movement.items.map((item) =>
        this.stockService.decrease(getProductId(item.product), item.quantity),
      ),
    );

    return (await this.movementRepository.updateStatus(
      id,
      "aprobado",
      approverId,
    ))!;
  }

  async rejectBaja(id: string, approverId: string): Promise<IMovement> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) throw new AppError("Movimiento no encontrado", 404);
    if (movement.type !== "baja")
      throw new AppError("Solo se pueden rechazar movimientos de baja", 400);
    if (movement.status !== "pendiente")
      throw new AppError(`El movimiento ya fue ${movement.status}`, 409);

    return (await this.movementRepository.updateStatus(
      id,
      "rechazado",
      approverId,
    ))!;
  }
}
