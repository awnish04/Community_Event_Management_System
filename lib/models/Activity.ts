/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from "./BaseModel"
import { ValidationResult } from "../interfaces/IEntity"

/**
 * Activity type enum
 */
export enum ActivityType {
  WORKSHOP = "workshop",
  TALK = "talk",
  GAME = "game",
  NETWORKING = "networking",
  PANEL = "panel",
  OTHER = "other",
}

/**
 * Activity class
 * Demonstrates OOP principles: Inheritance, Encapsulation
 */
export class Activity extends BaseModel {
  protected _name: string
  protected _description?: string
  protected _type: ActivityType

  constructor(data: {
    id?: number
    name: string
    description?: string
    type: ActivityType
    createdAt?: Date
    updatedAt?: Date
  }) {
    super(data)
    this._name = data.name
    this._description = data.description
    this._type = data.type
  }

  // Getters (Encapsulation)
  get name(): string {
    return this._name
  }

  get description(): string | undefined {
    return this._description
  }

  get type(): ActivityType {
    return this._type
  }

  // Setters (Encapsulation)
  set name(value: string) {
    this._name = value
  }

  set description(value: string | undefined) {
    this._description = value
  }

  set type(value: ActivityType) {
    this._type = value
  }

  /**
   * Validate activity data
   * Implements abstract method from BaseModel (Polymorphism)
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = []

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Activity name is required")
    }

    if (!this._type) {
      errors.push("Activity type is required")
    }

    return this.createValidationResult(errors.length === 0, errors)
  }

  /**
   * Convert to JSON (override parent method - Polymorphism)
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      name: this._name,
      description: this._description,
      type: this._type,
    }
  }
}
