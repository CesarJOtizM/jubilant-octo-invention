import { Entity } from "@/shared/domain";

export interface UserProps {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
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
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      roles: props.roles,
      permissions: props.permissions,
    });
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
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

  get roles(): string[] {
    return [...this.props.roles];
  }

  get permissions(): string[] {
    return [...this.props.permissions];
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
