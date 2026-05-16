/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity, IValidatable, ValidationResult } from "../interfaces/IEntity"

/**
 * Abstract base class for all models
 * Demonstrates OOP principles: Abstraction, Encapsulation, Inheritance
 */
export abstract class BaseModel implements IEntity, IValidatable {
  protected _id?: number
  protected _createdAt?: Date
  protected _updatedAt?: Date

  constructor(
    data?: Partial<BaseModel> & {
      _id?: number
      _createdAt?: Date
      _updatedAt?: Date
    }
  ) {
    if (data) {
      this._id = data._id
      this._createdAt = data._createdAt
      this._updatedAt = data._updatedAt
    }
  }

  // Getters (Encapsulation)
  get id(): number | undefined {
    return this._id
  }

  get createdAt(): Date | undefined {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  // Setters (Encapsulation)
  set id(value: number | undefined) {
    this._id = value
  }

  set createdAt(value: Date | undefined) {
    this._createdAt = value
  }

  set updatedAt(value: Date | undefined) {
    this._updatedAt = value
  }

  /**
   * Abstract method - must be implemented by child classes
   * Demonstrates OOP principle: Abstraction and Polymorphism
   */
  abstract validate(): Promise<ValidationResult>

  /**
   * Convert model to plain object
   * Can be overridden by child classes (Polymorphism)
   */
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    }
  }

  /**
   * Helper method for validation
   */
  protected createValidationResult(
    isValid: boolean,
    errors: string[] = []
  ): ValidationResult {
    return { isValid, errors }
  }
}
