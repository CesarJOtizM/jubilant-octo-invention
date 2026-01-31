import { User } from "../entities/user";
import { Tokens } from "../value-objects/tokens";

export interface LoginCredentials {
  organizationSlug: string;
  email: string;
  password: string;
}

export interface AuthRepositoryPort {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(refreshToken: string): Promise<Tokens>;
}
