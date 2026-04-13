import { Router } from "express";
import { UserController } from "../controllers/userController";
import { protect, requireRole } from "../middleware/auth";
import { validateObjectId } from "../middleware/validateObjectId";
import { validateCreateUser, validateUpdateUser } from "../middleware/validateUser";
import { userService } from "../container";
import { ROLES } from "../types/roles";

const router = Router();
const controller = new UserController(userService);

// Todas las rutas exigen token + rol ADMIN
router.use(protect, requireRole(ROLES.ADMIN));

router.get("/", controller.getAll);
router.get("/:id", validateObjectId, controller.getById);
router.post("/", validateCreateUser, controller.create);
router.put("/:id", validateObjectId, validateUpdateUser, controller.update);
router.delete("/:id", validateObjectId, controller.delete);

export default router;
