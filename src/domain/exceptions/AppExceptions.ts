// ─── Custom Application Exceptions ───────────────────────────────────────────
// Demonstrates: Inheritance (all extend Error), Encapsulation, typed error handling

// ── Base application error ────────────────────────────────────────────────────
export class AppException extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    // Ensures instanceof works correctly with TypeScript + transpiled classes
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

// ── Event exceptions ──────────────────────────────────────────────────────────

export class EventNotFoundException extends AppException {
  constructor(id: number) {
    super(`Event with ID ${id} was not found.`, 404)
  }
}

export class EventFullException extends AppException {
  constructor(eventName?: string) {
    super(
      eventName
        ? `Event "${eventName}" is at full capacity. No more registrations are accepted.`
        : "This event is at full capacity.",
      409
    )
  }
}

// ── Registration exceptions ───────────────────────────────────────────────────

export class DuplicateRegistrationException extends AppException {
  constructor(eventName?: string) {
    super(
      eventName
        ? `You are already registered for "${eventName}".`
        : "You are already registered for this event.",
      409
    )
  }
}

export class RegistrationNotFoundException extends AppException {
  constructor(id: number) {
    super(`Registration with ID ${id} was not found.`, 404)
  }
}

// ── User exceptions ───────────────────────────────────────────────────────────

export class UserNotFoundException extends AppException {
  constructor(identifier: string | number) {
    super(`User "${identifier}" was not found.`, 404)
  }
}

export class DuplicateEmailException extends AppException {
  constructor(email: string) {
    super(`An account with email "${email}" already exists.`, 409)
  }
}

// ── Auth exceptions ───────────────────────────────────────────────────────────

export class UnauthorizedAccessException extends AppException {
  constructor(action?: string) {
    super(
      action
        ? `You are not authorised to perform: ${action}.`
        : "You are not authorised to perform this action.",
      403
    )
  }
}

export class InvalidCredentialsException extends AppException {
  constructor() {
    super("Invalid email or password.", 401)
  }
}
