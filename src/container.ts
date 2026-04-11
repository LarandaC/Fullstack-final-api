import { UserRepository } from "./repositories/UserRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { MovementRepository } from "./repositories/MovementRepository";
import { CategoryRepository } from "./repositories/CategoryRepository";
import { AuthService } from "./services/AuthService";
import { ProductService } from "./services/ProductService";
import { MovementService } from "./services/MovementService";
import { CategoryService } from "./services/CategoryService";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const movementRepository = new MovementRepository();
const categoryRepository = new CategoryRepository();

export const authService = new AuthService(userRepository);
export const productService = new ProductService(productRepository);
export const movementService = new MovementService(movementRepository, productRepository);
export const categoryService = new CategoryService(categoryRepository, productRepository);
