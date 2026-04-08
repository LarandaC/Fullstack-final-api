import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authService } from "../container";

const router = Router();
const controller = new AuthController(authService);

router.post("/register", controller.register);
router.post("/login", controller.login);

export default router;
