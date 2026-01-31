import { User } from "../../domain/entities/user";
import type { LoginResponseDto } from "../../application/dto/login.dto";

export class UserMapper {
  static toDomain(dto: LoginResponseDto["user"]): User {
    return User.create({
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      organizationId: dto.organizationId,
      roles: dto.roles,
      permissions: dto.permissions,
      isActive: dto.isActive,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    });
  }
}
