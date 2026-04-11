import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { protect, adminOnly } from "../middleware/auth";
import { validateObjectId } from "../middleware/validateObjectId";
import { validateCreateCategory, validateUpdateCategory } from "../middleware/validateCategory";
import { categoryService } from "../container";

const router = Router();
const controller = new CategoryController(categoryService);

router.get("/", protect, controller.getAll);
router.get("/:id", protect, validateObjectId, controller.getById);
router.post("/", protect, validateCreateCategory, controller.create);
router.put("/:id", protect, validateObjectId, validateUpdateCategory, controller.update);
router.delete("/:id", protect, adminOnly, validateObjectId, controller.delete);

export default router;
