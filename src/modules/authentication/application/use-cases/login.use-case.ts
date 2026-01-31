import type {
  AuthRepositoryPort,
  LoginCredentials,
} from "../../domain/ports/auth-repository.port";
import type { User } from "../../domain/entities/user";
import type { Tokens } from "../../domain/value-objects/tokens";

export interface LoginResult {
  user: User;
  tokens: Tokens;
}

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.authRepository.login(credentials);
  }
}
