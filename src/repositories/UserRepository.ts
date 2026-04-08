import User, { IUser } from "../models/User";
import { IUserRepository, CreateUserData } from "../interfaces/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async create(data: CreateUserData): Promise<IUser> {
    return User.create(data);
  }
}
