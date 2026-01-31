import { AuthApiAdapter } from "@/modules/authentication/infrastructure/adapters/auth-api.adapter";
import type { AuthRepositoryPort } from "@/modules/authentication/domain/ports/auth-repository.port";

export interface Container {
  authRepository: AuthRepositoryPort;
}

export function createContainer(): Container {
  return {
    authRepository: new AuthApiAdapter(),
  };
}

let container: Container | null = null;

export function getContainer(): Container {
  if (!container) {
    container = createContainer();
  }
  return container;
}
