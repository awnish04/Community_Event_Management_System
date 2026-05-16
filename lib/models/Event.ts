/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from "./BaseModel"
import { ValidationResult } from "../interfaces/IEntity"

/**
 * Event class
 * Demonstrates OOP principles: Inheritance, Encapsulation
 */
export class Event extends BaseModel {
  protected _name: string
  protected _description: string
  protected _eventDate: Date
  protected _eventTime: string
  protected _venueId?: number
  protected _capacity: number
  protected _createdBy?: number
  protected _currentRegistrations: number = 0

  constructor(data: {
    id?: number
    name: string
    description: string
    eventDate: Date
    eventTime: string
    venueId?: number
    capacity: number
    createdBy?: number
    currentRegistrations?: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    super(data)
    this._name = data.name
    this._description = data.description
    this._eventDate = data.eventDate
    this._eventTime = data.eventTime
    this._venueId = data.venueId
    this._capacity = data.capacity
    this._createdBy = data.createdBy
    this._currentRegistrations = data.currentRegistrations || 0
  }

  // Getters (Encapsulation)
  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get eventDate(): Date {
    return this._eventDate
  }

  get eventTime(): string {
    return this._eventTime
  }

  get venueId(): number | undefined {
    return this._venueId
  }

  get capacity(): number {
    return this._capacity
  }

  get createdBy(): number | undefined {
    return this._createdBy
  }

  get currentRegistrations(): number {
    return this._currentRegistrations
  }

  // Setters (Encapsulation)
  set name(value: string) {
    this._name = value
  }

  set description(value: string) {
    this._description = value
  }

  set eventDate(value: Date) {
    this._eventDate = value
  }

  set eventTime(value: string) {
    this._eventTime = value
  }

  set venueId(value: number | undefined) {
    this._venueId = value
  }

  set capacity(value: number) {
    this._capacity = value
  }

  set createdBy(value: number | undefined) {
    this._createdBy = value
  }

  set currentRegistrations(value: number) {
    this._currentRegistrations = value
  }

  /**
   * Validate event data
   * Implements abstract method from BaseModel (Polymorphism)
   */
  async validate(): Promise<ValidationResult> {
    const errors: string[] = []

    if (!this._name || this._name.trim().length === 0) {
      errors.push("Event name is required")
    }

    if (!this._description || this._description.trim().length === 0) {
      errors.push("Event description is required")
    }

    if (!this._eventDate) {
      errors.push("Event date is required")
    } else if (this._eventDate < new Date()) {
      errors.push("Event date must be in the future")
    }

    if (!this._eventTime || this._eventTime.trim().length === 0) {
      errors.push("Event time is required")
    }

    if (!this._capacity || this._capacity <= 0) {
      errors.push("Event capacity must be greater than 0")
    }

    return this.createValidationResult(errors.length === 0, errors)
  }

  /**
   * Check if event is full
   */
  isFull(): boolean {
    return this._currentRegistrations >= this._capacity
  }

  /**
   * Check if event is upcoming
   */
  isUpcoming(): boolean {
    return this._eventDate > new Date()
  }

  /**
   * Check if event is past
   */
  isPast(): boolean {
    return this._eventDate < new Date()
  }

  /**
   * Get available spots
   */
  getAvailableSpots(): number {
    return Math.max(0, this._capacity - this._currentRegistrations)
  }

  /**
   * Get occupancy percentage
   */
  getOccupancyPercentage(): number {
    return (this._currentRegistrations / this._capacity) * 100
  }

  /**
   * Convert to JSON (override parent method - Polymorphism)
   */
  override toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      name: this._name,
      description: this._description,
      eventDate: this._eventDate,
      eventTime: this._eventTime,
      venueId: this._venueId,
      capacity: this._capacity,
      createdBy: this._createdBy,
      currentRegistrations: this._currentRegistrations,
      availableSpots: this.getAvailableSpots(),
      isFull: this.isFull(),
      isUpcoming: this.isUpcoming(),
    }
  }
}
