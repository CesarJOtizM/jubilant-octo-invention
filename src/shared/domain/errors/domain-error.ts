export abstract class DomainError extends Error {
  readonly code: string;
  readonly timestamp: Date;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends DomainError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR");
    this.field = field;
  }
}

export class NotFoundError extends DomainError {
  readonly entityName: string;
  readonly entityId: string;

  constructor(entityName: string, entityId: string) {
    super(`${entityName} with id ${entityId} not found`, "NOT_FOUND");
    this.entityName = entityName;
    this.entityId = entityId;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Access forbidden") {
    super(message, "FORBIDDEN");
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, "CONFLICT");
  }
}
