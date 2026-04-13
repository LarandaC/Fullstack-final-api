import type {
  IMovementService,
  CreateCompraInput,
  CreateBajaInput,
} from "../interfaces/services/IMovementService";
import type { IMovementRepository } from "../interfaces/repositories/IMovementRepository";
import type { IStockService } from "../interfaces/services/IStockService";
import type { IMovement } from "../models/Movement";
import { AppError } from "../errors/AppError";

export class MovementService implements IMovementService {
  constructor(
    private readonly movementRepository: IMovementRepository,
    private readonly stockService: IStockService,
  ) {}

  // ─── Consultas ───────────────────────────────────────────────────────────────

  async getAll(): Promise<IMovement[]> {
    return this.movementRepository.findAll();
  }

  async getById(id: string): Promise<IMovement> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) throw new AppError("Movimiento no encontrado", 404);
    return movement;
  }

  async getByProduct(productId: string): Promise<IMovement[]> {
    return this.movementRepository.findByProduct(productId);
  }

  // ─── Compra ──────────────────────────────────────────────────────────────────

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

  // ─── Baja ────────────────────────────────────────────────────────────────────

  async createBaja(
    data: CreateBajaInput,
    userId: string,
  ): Promise<IMovement> {
    await Promise.all(
      data.items.map((item) =>
        this.stockService.validateSufficientStock(item.product, item.quantity),
      ),
    );

    return this.movementRepository.createBaja({ ...data, createdBy: userId });
  }

  // ─── Aprobación de baja ───────────────────────────────────────────────────────

  async approveBaja(id: string, approverId: string): Promise<IMovement> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) throw new AppError("Movimiento no encontrado", 404);
    if (movement.type !== "baja")
      throw new AppError("Solo se pueden aprobar movimientos de baja", 400);
    if (movement.status !== "pendiente")
      throw new AppError(`El movimiento ya fue ${movement.status}`, 409);

    // Re-validar stock al momento de aprobación (puede haber cambiado)
    await Promise.all(
      movement.items.map((item) =>
        this.stockService.validateSufficientStock(
          item.product.toString(),
          item.quantity,
        ),
      ),
    );

    await Promise.all(
      movement.items.map((item) =>
        this.stockService.decrease(item.product.toString(), item.quantity),
      ),
    );

    return (await this.movementRepository.updateStatus(
      id,
      "aprobado",
      approverId,
    ))!;
  }

  // ─── Rechazo de baja ──────────────────────────────────────────────────────────

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
