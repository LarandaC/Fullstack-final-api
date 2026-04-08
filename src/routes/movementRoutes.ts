import { Router } from "express";
import { MovementController } from "../controllers/movementController";
import { protect } from "../middleware/auth";
import { movementService } from "../container";

const router = Router();
const controller = new MovementController(movementService);

router.get("/", protect, controller.getAll);
router.post("/", protect, controller.create);
router.get("/product/:productId", protect, controller.getByProduct);

export default router;
