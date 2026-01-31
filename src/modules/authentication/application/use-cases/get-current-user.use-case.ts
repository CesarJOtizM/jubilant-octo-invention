import type { AuthRepositoryPort } from "../../domain/ports/auth-repository.port";
import type { User } from "../../domain/entities/user";

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
