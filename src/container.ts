import { UserRepository } from "./repositories/UserRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { MovementRepository } from "./repositories/MovementRepository";
import { AuthService } from "./services/AuthService";
import { ProductService } from "./services/ProductService";
import { MovementService } from "./services/MovementService";

const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const movementRepository = new MovementRepository();

export const authService = new AuthService(userRepository);
export const productService = new ProductService(productRepository);
export const movementService = new MovementService(movementRepository, productRepository);
