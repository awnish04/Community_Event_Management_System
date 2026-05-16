/**
 * Base Exception class for all custom exceptions
 * Demonstrates OOP principle: Inheritance and custom error handling
 */
export class BaseException extends Error {
  public readonly statusCode: number
  public readonly timestamp: Date

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.timestamp = new Date()
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    }
  }
}

/**
 * Exception for validation errors
 */
export class ValidationException extends BaseException {
  public readonly errors: string[]

  constructor(message: string, errors: string[] = []) {
    super(message, 400)
    this.errors = errors
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    }
  }
}

/**
 * Exception for resource not found errors
 */
export class NotFoundException extends BaseException {
  constructor(resource: string, id?: number | string) {
    const message = id
      ? `${resource} with id ${id} not found`
      : `${resource} not found`
    super(message, 404)
  }
}

/**
 * Exception for duplicate resource errors
 */
export class DuplicateException extends BaseException {
  constructor(resource: string, field: string) {
    super(`${resource} with this ${field} already exists`, 409)
  }
}

/**
 * Exception for unauthorized access
 */
export class UnauthorizedException extends BaseException {
  constructor(message: string = "Unauthorized access") {
    super(message, 401)
  }
}

/**
 * Exception for forbidden access
 */
export class ForbiddenException extends BaseException {
  constructor(message: string = "Access forbidden") {
    super(message, 403)
  }
}

/**
 * Exception for event registration errors
 */
export class RegistrationException extends BaseException {
  constructor(message: string) {
    super(message, 400)
  }
}

/**
 * Exception for event capacity errors
 */
export class EventFullException extends RegistrationException {
  constructor(eventName: string) {
    super(`Event "${eventName}" has reached maximum capacity`)
  }
}

/**
 * Exception for duplicate registration
 */
export class AlreadyRegisteredException extends RegistrationException {
  constructor() {
    super("You are already registered for this event")
  }
}

/**
 * Exception for database errors
 */
export class DatabaseException extends BaseException {
  constructor(message: string, originalError?: Error) {
    super(`Database error: ${message}`, 500)
    if (originalError) {
      this.stack = originalError.stack
    }
  }
}
