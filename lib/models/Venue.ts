/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from "./BaseModel"
import { ValidationResult } from "../interfaces/IEntity"

/**
 * Venue class
 * Demonstrates OOP principles: Inheritance, Encapsulation
 */
export class Venue extends BaseModel {
  protected _name: string
  protected _address: string
  protected _capacity: number
  protected _description?: string

  constructor(data: {
    id?: number
    name: string
    address: string
    capacity: number
    description?: string
    createdAt?: Date
    updatedAt?: Date
  }) {
    super(data)
    this._name = data.name
    this._address = data.address
    this._capacity = data.capacity
    this._description = data.description
  }

  // Getters (Encapsulation)
  get name(): string {
    return this._name
  }

  get address(): string {
    return this._address
  }

  get capacity(): number {
    return this._capacity
  }

  get description(): string | undefined {
    return this._description
  }

  // Setters (Encapsulation)
  set name(value: string) {
    this._name = value
  }

  set address(value: string) {
    this._address = value
  }

  set capacity(value: number) {
    this._capacity = value
  }

  set description(value: string | undefined) {
    this._description = value
  }

  /**
   * Validate venue data
   * Implements abstract method from BaseModel (Polymorphism)
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = []

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Venue name is required")
    }

    if (!this._address || this._address.trim().length === 0) {
      errors.push("Venue address is required")
    }

    if (!this._capacity || this._capacity <= 0) {
      errors.push("Venue capacity must be greater than 0")
    }

    return this.createValidationResult(errors.length === 0, errors)
  }

  /**
   * Check if venue can accommodate event capacity
   */
  canAccommodate(eventCapacity: number): boolean {
    return this._capacity >= eventCapacity
  }

  /**
   * Convert to JSON (override parent method - Polymorphism)
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      name: this._name,
      address: this._address,
      capacity: this._capacity,
      description: this._description,
    }
  }
}
