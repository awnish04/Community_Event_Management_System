/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from "./BaseModel"
import { ValidationResult } from "../interfaces/IEntity"

/**
 * Registration status enum
 */
export enum RegistrationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  WAITLIST = "waitlist",
}

/**
 * Registration class
 * Demonstrates OOP principles: Inheritance, Encapsulation
 */
export class Registration extends BaseModel {
  protected _participantId: number
  protected _eventId: number
  protected _status: RegistrationStatus
  protected _registrationDate: Date

  constructor(data: {
    id?: number
    participantId: number
    eventId: number
    status?: RegistrationStatus
    registrationDate?: Date
    createdAt?: Date
    updatedAt?: Date
  }) {
    super(data)
    this._participantId = data.participantId
    this._eventId = data.eventId
    this._status = data.status || RegistrationStatus.PENDING
    this._registrationDate = data.registrationDate || new Date()
  }

  // Getters (Encapsulation)
  get participantId(): number {
    return this._participantId
  }

  get eventId(): number {
    return this._eventId
  }

  get status(): RegistrationStatus {
    return this._status
  }

  get registrationDate(): Date {
    return this._registrationDate
  }

  // Setters (Encapsulation)
  set participantId(value: number) {
    this._participantId = value
  }

  set eventId(value: number) {
    this._eventId = value
  }

  set status(value: RegistrationStatus) {
    this._status = value
  }

  set registrationDate(value: Date) {
    this._registrationDate = value
  }

  /**
   * Validate registration data
   * Implements abstract method from BaseModel (Polymorphism)
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = []

    if (!this._participantId || this._participantId <= 0) {
      errors.push("Valid participant ID is required")
    }

    if (!this._eventId || this._eventId <= 0) {
      errors.push("Valid event ID is required")
    }

    if (!this._registrationDate) {
      errors.push("Registration date is required")
    }

    return this.createValidationResult(errors.length === 0, errors)
  }

  /**
   * Check if registration is active
   */
  isActive(): boolean {
    return (
      this._status === RegistrationStatus.CONFIRMED ||
      this._status === RegistrationStatus.PENDING
    )
  }

  /**
   * Check if registration is cancelled
   */
  isCancelled(): boolean {
    return this._status === RegistrationStatus.CANCELLED
  }

  /**
   * Check if registration is on waitlist
   */
  isWaitlisted(): boolean {
    return this._status === RegistrationStatus.WAITLIST
  }

  /**
   * Confirm registration
   */
  confirm(): void {
    this._status = RegistrationStatus.CONFIRMED
  }

  /**
   * Cancel registration
   */
  cancel(): void {
    this._status = RegistrationStatus.CANCELLED
  }

  /**
   * Move to waitlist
   */
  moveToWaitlist(): void {
    this._status = RegistrationStatus.WAITLIST
  }

  /**
   * Convert to JSON (override parent method - Polymorphism)
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      participantId: this._participantId,
      eventId: this._eventId,
      status: this._status,
      registrationDate: this._registrationDate,
      isActive: this.isActive(),
      isCancelled: this.isCancelled(),
      isWaitlisted: this.isWaitlisted(),
    }
  }
}
