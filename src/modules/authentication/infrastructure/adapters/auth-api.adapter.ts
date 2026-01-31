import type {
  AuthRepositoryPort,
  LoginCredentials,
} from "../../domain/ports/auth-repository.port";
import type { User } from "../../domain/entities/user";
import { Tokens } from "../../domain/value-objects/tokens";
import { UserMapper } from "../mappers/user.mapper";
import type { LoginResponseDto } from "../../application/dto/login.dto";
import { env } from "@/config/env";

export class AuthApiAdapter implements AuthRepositoryPort {
  private readonly baseUrl = env.NEXT_PUBLIC_API_URL;

  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; tokens: Tokens }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data: LoginResponseDto = await response.json();

    const expiresAt = new Date(Date.now() + data.tokens.expiresIn * 1000);
    return {
      user: UserMapper.toDomain(data.user),
      tokens: Tokens.create(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        expiresAt,
      ),
    };
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return UserMapper.toDomain(data);
    } catch {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expiresIn * 1000);
    return Tokens.create(data.accessToken, data.refreshToken, expiresAt);
  }
}
