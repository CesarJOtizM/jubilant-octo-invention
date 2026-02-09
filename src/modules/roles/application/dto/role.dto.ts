export interface PermissionResponseDto {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
}

export interface RoleResponseDto {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  permissions?: PermissionResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  description?: string;
  isActive?: boolean;
}

export interface AssignPermissionsDto {
  permissionIds: string[];
}

export interface RoleFilters {
  search?: string;
  isSystem?: boolean;
  isActive?: boolean;
}
