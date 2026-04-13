import type { UserRole } from "../../types/roles";

export interface IProductAccessPolicy {
  /** Strips price fields from a response if the role cannot view prices */
  filterResponse<T>(data: T, role: UserRole | undefined): T;

  /** Strips/forces price fields on the create payload based on role */
  filterCreatePayload(
    body: Record<string, unknown>,
    role: UserRole,
  ): Record<string, unknown>;

  /** Restricts updatable fields based on role */
  filterUpdatePayload(
    body: Record<string, unknown>,
    role: UserRole,
  ): Record<string, unknown>;
}
