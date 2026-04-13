import type { IUser } from "../../models/User";
import type { CreateUserData, UpdateUserData } from "../repositories/IUserRepository";

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  create(data: CreateUserData): Promise<IUser>;
  update(id: string, data: UpdateUserData, requesterId: string): Promise<IUser>;
  delete(id: string, requesterId: string): Promise<void>;
}
