import { Entity } from "@/shared/domain";

export interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<string> {
  private readonly props: Omit<UserProps, "id">;

  private constructor(id: string, props: Omit<UserProps, "id">) {
    super(id);
    this.props = props;
  }

  static create(props: UserProps): User {
    return new User(props.id, {
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      organizationId: props.organizationId,
      roles: props.roles,
      permissions: props.permissions,
      isActive: props.isActive,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get roles(): string[] {
    return [...this.props.roles];
  }

  get permissions(): string[] {
    return [...this.props.permissions];
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  hasPermission(permission: string): boolean {
    return this.props.permissions.includes(permission);
  }

  hasRole(role: string): boolean {
    return this.props.roles.includes(role);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }
}
