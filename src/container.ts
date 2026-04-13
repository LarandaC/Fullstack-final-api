import { UserRepository } from "./repositories/UserRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { MovementRepository } from "./repositories/MovementRepository";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { AuthService } from "./services/AuthService";
import { UserService } from "./services/UserService";
import { ProductService } from "./services/ProductService";
import { MovementService } from "./services/MovementService";
import { CategoryService } from "./services/CategoryService";
import { StockService } from "./services/StockService";
import { ProductAccessPolicy } from "./policies/ProductAccessPolicy";
import { env } from "./config/env";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const movementRepository = new MovementRepository();
const categoryRepository = new CategoryRepository();

export const authService = new AuthService(userRepository, {
  secret: env.jwtSecret,
  expiresIn: env.jwtExpiresIn,
});
export const userService = new UserService(userRepository);
export const productService = new ProductService(productRepository);
export const productAccessPolicy = new ProductAccessPolicy();
const stockService = new StockService(productRepository);
export const movementService = new MovementService(movementRepository, stockService);
export const categoryService = new CategoryService(categoryRepository, productRepository);
