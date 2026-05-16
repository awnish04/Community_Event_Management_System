/* eslint-disable @typescript-eslint/no-explicit-any */
import { IManageable } from "../interfaces/IEntity"
import {
  DatabaseException,
  NotFoundException,
} from "../exceptions/BaseException"

/**
 * Abstract Base Repository class
 * Demonstrates Design Pattern: Repository Pattern
 * Demonstrates OOP: Abstract class, Generics
 *
 * Purpose: Separates data access logic from business logic
 */
export abstract class BaseRepository<T> implements IManageable<T> {
  /**
   * Create a new entity
   * Must be implemented by child classes
   */
  abstract create(data: Partial<T>): Promise<T>

  /**
   * Update an existing entity
   * Must be implemented by child classes
   */
  abstract update(id: number, data: Partial<T>): Promise<T>

  /**
   * Delete an entity
   * Must be implemented by child classes
   */
  abstract delete(id: number): Promise<boolean>

  /**
   * Find entity by ID
   * Must be implemented by child classes
   */
  abstract findById(id: number): Promise<T | null>

  /**
   * Find all entities
   * Must be implemented by child classes
   */
  abstract findAll(): Promise<T[]>

  /**
   * Helper method to handle database errors
   * Demonstrates: Error handling and encapsulation
   */
  protected handleDatabaseError(error: any, operation: string): never {
    console.error(`Database error during ${operation}:`, error)
    throw new DatabaseException(
      `Failed to ${operation}`,
      error instanceof Error ? error : undefined
    )
  }

  /**
   * Helper method to ensure entity exists
   * Demonstrates: Reusable validation logic
   */
  protected async ensureExists(id: number, entityName: string): Promise<void> {
    const entity = await this.findById(id)
    if (!entity) {
      throw new NotFoundException(entityName, id)
    }
  }
}
