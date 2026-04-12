import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { protect, requireRole } from "../middleware/auth";
import { productService } from "../container";
import {
  ROLES,
  MANAGEMENT_ROLES,
  PRODUCT_EDIT_ROLES,
} from "../types/roles";

const router = Router();
const controller = new ProductController(productService);

router.get("/", protect, controller.getAll);
router.get("/:id", protect, controller.getById);
router.post("/", protect, requireRole(...MANAGEMENT_ROLES), controller.create);
router.put("/:id", protect, requireRole(...PRODUCT_EDIT_ROLES), controller.update);
router.delete("/:id", protect, requireRole(ROLES.ADMIN), controller.delete);

export default router;
