import { IUser } from "../../models/User";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "operario";
}

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserData): Promise<IUser>;
}
