import { IProductAccessPolicy } from "../interfaces/policies/IProductAccessPolicy";
import { PRICE_ROLES, ROLES, type UserRole } from "../types/roles";

const PRICE_FIELDS = ["purchasePrice", "salePrice", "iva"] as const;

export class ProductAccessPolicy implements IProductAccessPolicy {
  filterResponse<T>(data: T, role: UserRole | undefined): T {
    if (PRICE_ROLES.includes(role as UserRole)) return data;

    const plain = JSON.parse(JSON.stringify(data)) as Record<string, unknown>;

    // Paginated response: { data: [...], total, pageCount }
    if (plain.data && Array.isArray(plain.data)) {
      plain.data = (plain.data as Record<string, unknown>[]).map(
        this.stripPriceFields,
      );
      return plain as T;
    }

    return this.stripPriceFields(plain) as T;
  }

  filterCreatePayload(
    body: Record<string, unknown>,
    role: UserRole,
  ): Record<string, unknown> {
    if (role !== ROLES.SUPERVISOR) return body;

    const filtered = this.stripPriceFields({ ...body });
    filtered.purchasePrice = 0;
    filtered.salePrice = 0;
    filtered.iva = 0;
    return filtered;
  }

  filterUpdatePayload(
    body: Record<string, unknown>,
    role: UserRole,
  ): Record<string, unknown> {
    if (role === ROLES.SUPERVISOR) {
      return this.stripPriceFields({ ...body });
    }

    if (role === ROLES.FINANCIERO) {
      const { purchasePrice, salePrice, iva } = body;
      return Object.fromEntries(
        Object.entries({ purchasePrice, salePrice, iva }).filter(
          ([, v]) => v !== undefined,
        ),
      );
    }

    return body;
  }

  private stripPriceFields(
    product: Record<string, unknown>,
  ): Record<string, unknown> {
    const result = { ...product };
    for (const field of PRICE_FIELDS) {
      delete result[field];
    }
    return result;
  }
}
