import type { UserRole } from "../../types/roles";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResult {
  user: UserPayload;
}

export interface LoginResult {
  token: string;
  user: UserPayload;
}

export interface IAuthService {
  register(data: RegisterInput): Promise<RegisterResult>;
  login(data: LoginInput): Promise<LoginResult>;
}
