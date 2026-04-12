export const ROLES = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  INVENTARISTA: "inventarista",
  FINANCIERO: "financiero",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/** Roles que pueden ver y editar campos de precio */
export const PRICE_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.FINANCIERO];

/** Roles que pueden gestionar productos y categorías */
export const MANAGEMENT_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.SUPERVISOR];

/** Roles que pueden registrar movimientos */
export const MOVEMENT_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.SUPERVISOR,
  ROLES.INVENTARISTA,
];

/** Roles que pueden editar un producto (campos no-precio) */
export const PRODUCT_EDIT_ROLES: UserRole[] = [
  ROLES.ADMIN,
  ROLES.SUPERVISOR,
  ROLES.FINANCIERO,
];
