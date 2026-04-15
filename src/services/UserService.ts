import bcrypt from "bcryptjs";
import type { IUserService } from "../interfaces/services/IUserService";
import type {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
  UserFilters,
} from "../interfaces/repositories/IUserRepository";
import type { IUser } from "../models/User";
import { AppError } from "../errors/AppError";
import { ROLES } from "../types/roles";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAll(filters?: UserFilters): Promise<IUser[]> {
    return this.userRepository.findAll(filters);
  }

  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return user;
  }

  async create(data: CreateUserData): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError("Ya existe un usuario con ese email", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.create({ ...data, password: hashedPassword });
  }

  async update(
    id: string,
    data: UpdateUserData,
    requesterId: string,
  ): Promise<IUser> {
    const target = await this.userRepository.findById(id);
    if (!target) {
      throw new AppError("Usuario no encontrado", 404);
    }

    // Si cambia el email, verificar que no esté en uso
    if (data.email && data.email !== target.email) {
      const emailInUse = await this.userRepository.findByEmail(data.email);
      if (emailInUse) {
        throw new AppError("Ese email ya está en uso por otro usuario", 409);
      }
    }

    // Proteger: el admin no puede degradar su propio rol
    if (
      id === requesterId &&
      data.role !== undefined &&
      data.role !== ROLES.ADMIN
    ) {
      throw new AppError("No puedes cambiar tu propio rol de administrador", 403);
    }

    // Proteger: no dejar al sistema sin ningún admin
    if (data.role !== undefined && data.role !== ROLES.ADMIN && target.role === ROLES.ADMIN) {
      const adminCount = await this.userRepository.countByRole(ROLES.ADMIN);
      if (adminCount <= 1) {
        throw new AppError(
          "No se puede quitar el rol de administrador: es el único admin del sistema",
          409,
        );
      }
    }

    const updatePayload: UpdateUserData = { ...data };
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userRepository.update(id, updatePayload);
    if (!updated) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return updated;
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const target = await this.userRepository.findById(id);
    if (!target) {
      throw new AppError("Usuario no encontrado", 404);
    }

    // No puede eliminarse a sí mismo
    if (id === requesterId) {
      throw new AppError("No puedes eliminar tu propia cuenta", 403);
    }

    // No dejar al sistema sin admins
    if (target.role === ROLES.ADMIN) {
      const adminCount = await this.userRepository.countByRole(ROLES.ADMIN);
      if (adminCount <= 1) {
        throw new AppError(
          "No se puede eliminar al único administrador del sistema",
          409,
        );
      }
    }

    await this.userRepository.delete(id);
  }
}
