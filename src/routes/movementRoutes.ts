import { Router } from "express";
import { MovementController } from "../controllers/movementController";
import { protect, requireRole } from "../middleware/auth";
import { validateObjectId } from "../middleware/validateObjectId";
import { validateCreateCompra, validateCreateBaja } from "../middleware/validateMovement";
import { movementService } from "../container";
import { COMPRA_ROLES, BAJA_ROLES, APPROVAL_ROLES } from "../types/roles";

const router = Router();
const controller = new MovementController(movementService);

// Todas las rutas requieren autenticación
router.use(protect);

// ─── Consultas (todos los roles autenticados) ─────────────────────────────────
router.get("/", controller.getAll);
router.get("/product/:productId", validateObjectId, controller.getByProduct);
router.get("/:id", validateObjectId, controller.getById);

// ─── Compra (financiero + admin) ──────────────────────────────────────────────
router.post(
  "/compra",
  requireRole(...COMPRA_ROLES),
  validateCreateCompra,
  controller.createCompra,
);

// ─── Baja (supervisor + admin) ────────────────────────────────────────────────
router.post(
  "/baja",
  requireRole(...BAJA_ROLES),
  validateCreateBaja,
  controller.createBaja,
);

// ─── Aprobación / rechazo de baja (solo admin) ───────────────────────────────
router.patch(
  "/:id/approve",
  requireRole(...APPROVAL_ROLES),
  validateObjectId,
  controller.approveBaja,
);
router.patch(
  "/:id/reject",
  requireRole(...APPROVAL_ROLES),
  validateObjectId,
  controller.rejectBaja,
);

export default router;
