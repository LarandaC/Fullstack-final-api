import { Router } from "express";
import { MovementController } from "../controllers/movementController";
import { protect, requireRole } from "../middleware/auth";
import { movementService } from "../container";
import { MOVEMENT_ROLES } from "../types/roles";

const router = Router();
const controller = new MovementController(movementService);

router.get("/", protect, controller.getAll);
router.post("/", protect, requireRole(...MOVEMENT_ROLES), controller.create);
router.get("/product/:productId", protect, controller.getByProduct);

export default router;
