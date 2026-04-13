import { IUser } from "../../models/User";
import type { UserRole } from "../../types/roles";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserData): Promise<IUser>;
  update(id: string, data: UpdateUserData): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
  countByRole(role: UserRole): Promise<number>;
}
