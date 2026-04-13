export interface PriceUpdate {
  purchasePrice?: number;
  salePrice?: number;
}

export interface IStockService {
  /** Throws 404 if product does not exist */
  validateExists(productId: string): Promise<void>;

  /** Throws 400 if product stock is less than the requested quantity */
  validateSufficientStock(productId: string, quantity: number): Promise<void>;

  /** Increases stock by the given quantity (compra) */
  increase(productId: string, quantity: number): Promise<void>;

  /** Decreases stock by the given quantity (baja aprobada) */
  decrease(productId: string, quantity: number): Promise<void>;

  /** Updates purchase and/or sale price if provided */
  updatePrices(productId: string, prices: PriceUpdate): Promise<void>;
}
