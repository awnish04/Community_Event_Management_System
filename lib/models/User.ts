/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from "./BaseModel"
import { ValidationResult } from "../interfaces/IEntity"
import { ValidationException } from "../exceptions/BaseException"

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

/**
 * Base User class
 * Demonstrates OOP principles: Inheritance, Encapsulation
 */
export class User extends BaseModel {
  protected _name: string
  protected _email: string
  protected _phone?: string
  protected _password: string
  protected _role: UserRole

  constructor(data: {
    id?: number
    name: string
    email: string
    phone?: string
    password: string
    role?: UserRole
    createdAt?: Date
    updatedAt?: Date
  }) {
    super(data)
    this._name = data.name
    this._email = data.email
    this._phone = data.phone
    this._password = data.password
    this._role = data.role || UserRole.USER
  }

  // Getters
  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get phone(): string | undefined {
    return this._phone
  }

  get password(): string {
    return this._password
  }

  get role(): UserRole {
    return this._role
  }

  // Setters
  set name(value: string) {
    this._name = value
  }

  set email(value: string) {
    this._email = value
  }

  set phone(value: string | undefined) {
    this._phone = value
  }

  set password(value: string) {
    this._password = value
  }

  set role(value: UserRole) {
    this._role = value
  }

  /**
   * Validate user data
   * Implements abstract method from BaseModel (Polymorphism)
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = []

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Name is required")
    }

    if (!this._email || this._email.trim().length === 0) {
      errors.push("Email is required")
    } else if (!this.isValidEmail(this._email)) {
      errors.push("Invalid email format")
    }

    if (!this._password || this._password.length < 6) {
      errors.push("Password must be at least 6 characters")
    }

    if (this._phone && !this.isValidPhone(this._phone)) {
      errors.push("Invalid phone number format")
    }

    return this.createValidationResult(errors.length === 0, errors)
  }

  /**
   * Check if user is admin
   * Can be overridden by child classes (Polymorphism)
   */
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN
  }

  /**
   * Get user permissions
   * Can be overridden by child classes (Polymorphism)
   */
  getPermissions(): string[] {
    return ["read:events", "register:events"]
  }

  /**
   * Convert to JSON (override parent method - Polymorphism)
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      name: this._name,
      email: this._email,
      phone: this._phone,
      role: this._role,
    }
  }

  // Helper methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
  }
}

/**
 * AdminUser class - extends User
 * Demonstrates OOP principle: Inheritance and Polymorphism
 */
export class AdminUser extends User {
  constructor(data: {
    id?: number
    name: string
    email: string
    phone?: string
    password: string
    createdAt?: Date
    updatedAt?: Date
  }) {
    super({ ...data, role: UserRole.ADMIN })
  }

  /**
   * Override isAdmin method (Polymorphism)
   */
  override isAdmin(): boolean {
    return true
  }

  /**
   * Override getPermissions method (Polymorphism)
   */
  override getPermissions(): string[] {
    return [
      ...super.getPermissions(),
      "create:events",
      "update:events",
      "delete:events",
      "manage:users",
      "manage:venues",
      "manage:activities",
      "manage:registrations",
    ]
  }

  /**
   * Admin-specific method
   */
  canManageResource(resource: string): boolean {
    return this.getPermissions().some((perm) => perm.includes(resource))
  }
}

/**
 * RegularUser class - extends User
 * Demonstrates OOP principle: Inheritance and Polymorphism
 */
export class RegularUser extends User {
  constructor(data: {
    id?: number
    name: string
    email: string
    phone?: string
    password: string
    createdAt?: Date
    updatedAt?: Date
  }) {
    super({ ...data, role: UserRole.USER })
  }

  /**
   * Override getPermissions method (Polymorphism)
   */
  override getPermissions(): string[] {
    return ["read:events", "register:events", "view:own-registrations"]
  }
}
