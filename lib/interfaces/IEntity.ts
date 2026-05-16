/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base interface for all entities in the system
 * Demonstrates OOP principle: Interface definition
 */
export interface IEntity {
  id?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Interface for entities that can be validated
 * Demonstrates OOP principle: Interface segregation
 */
export interface IValidatable {
  validate(): Promise<ValidationResult>
}

/**
 * Interface for entities that support CRUD operations
 * Demonstrates OOP principle: Interface for common operations
 */
export interface IManageable<T> {
  create(data: Partial<T>): Promise<T>
  update(id: number, data: Partial<T>): Promise<T>
  delete(id: number): Promise<boolean>
  findById(id: number): Promise<T | null>
  findAll(): Promise<T[]>
}

/**
 * Interface for event registration capability
 * Demonstrates OOP principle: Interface segregation
 */
export interface IRegisterable {
  register(participantId: number, eventId: number): Promise<boolean>
  unregister(participantId: number, eventId: number): Promise<boolean>
  isRegistered(participantId: number, eventId: number): Promise<boolean>
}

/**
 * Interface for entities that can be filtered
 * Demonstrates OOP principle: Generic interface
 */
export interface IFilterable<T> {
  filter(criteria: FilterCriteria): Promise<T[]>
}

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean
  errors: string[]
}

/**
 * Filter criteria type
 */
export type FilterCriteria = {
  [key: string]: any
}
