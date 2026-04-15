import User, { IUser } from "../models/User";
import Movement from "../models/Movement";
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
  UserFilters,
} from "../interfaces/repositories/IUserRepository";
import type { UserRole } from "../types/roles";

export class UserRepository implements IUserRepository {
  async findAll(filters?: UserFilters): Promise<IUser[]> {
    const query: any = {};

    if (filters?.role && filters.role !== "todos") {
      query.role = filters.role;
    }

    if (filters?.hasMovements) {
      const activeUserIds = await Movement.distinct("createdBy");
      query._id = { $in: activeUserIds };
    }

    return User.find(query).select("-password").sort({ createdAt: -1 });
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
