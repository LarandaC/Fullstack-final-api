import type { IStockService, PriceUpdate } from "../interfaces/services/IStockService";
import type { IProductRepository } from "../interfaces/repositories/IProductRepository";
import { AppError } from "../errors/AppError";

export class StockService implements IStockService {
  constructor(private readonly productRepository: IProductRepository) {}

  async validateExists(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(`Producto no encontrado: ${productId}`, 404);
    }
  }

  async validateSufficientStock(
    productId: string,
    quantity: number,
  ): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError(`Producto no encontrado: ${productId}`, 404);
    }
    if (product.stock < quantity) {
      throw new AppError(
        `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${quantity}`,
        400,
      );
    }
  }

  async increase(productId: string, quantity: number): Promise<void> {
    await this.productRepository.updateStock(productId, quantity);
  }

  async decrease(productId: string, quantity: number): Promise<void> {
    console.log(`[StockService] Decreasing stock for ${productId} by ${quantity}`);
    await this.productRepository.updateStock(productId, -quantity);
  }

  async updatePrices(productId: string, prices: PriceUpdate): Promise<void> {
    const update = Object.fromEntries(
      Object.entries(prices).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(update).length > 0) {
      await this.productRepository.update(productId, update);
    }
  }
}
