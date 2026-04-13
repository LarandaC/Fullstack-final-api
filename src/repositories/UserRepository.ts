import User, { IUser } from "../models/User";
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from "../interfaces/repositories/IUserRepository";
import type { UserRole } from "../types/roles";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<IUser[]> {
    return User.find().select("-password").sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select("-password");
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async create(data: CreateUserData): Promise<IUser> {
    return User.create(data);
  }

  async update(id: string, data: UpdateUserData): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  async countByRole(role: UserRole): Promise<number> {
    return User.countDocuments({ role });
  }
}
