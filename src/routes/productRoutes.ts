import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { protect, adminOnly } from "../middleware/auth";
import { productService } from "../container";

const router = Router();
const controller = new ProductController(productService);

router.get("/", protect, controller.getAll);
router.get("/:id", protect, controller.getById);
router.post("/", protect, controller.create);
router.put("/:id", protect, controller.update);
router.delete("/:id", protect, adminOnly, controller.delete);

export default router;
