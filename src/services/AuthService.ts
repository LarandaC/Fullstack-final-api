import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IAuthService, RegisterInput, LoginInput, RegisterResult, LoginResult } from "../interfaces/services/IAuthService";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { AppError } from "../errors/AppError";

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: RegisterInput): Promise<RegisterResult> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("El email ya está registrado", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "operario",
    });

    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginInput): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciales inválidas", 400);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Credenciales inválidas", 400);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" },
    );

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
