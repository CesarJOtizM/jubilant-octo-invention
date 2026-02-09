import type { User } from "../../domain/entities/user.entity";
import type {
  CreateUserDto,
  UpdateUserDto,
  ChangeUserStatusDto,
  AssignRoleDto,
  UserFilters,
} from "../dto/user.dto";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserRepositoryPort {
  findAll(filters?: UserFilters): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  changeStatus(id: string, data: ChangeUserStatusDto): Promise<User>;
  assignRole(userId: string, data: AssignRoleDto): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
}
