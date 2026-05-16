/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"
import { BaseRepository } from "./BaseRepository"
import { User, AdminUser, RegularUser, UserRole } from "../models/User"
import {
  NotFoundException,
  DuplicateException,
} from "../exceptions/BaseException"

/**
 * User Repository
 * Demonstrates Design Pattern: Repository Pattern
 * Demonstrates Design Pattern: Factory Pattern (createUserInstance)
 */
export class UserRepository extends BaseRepository<User> {
  /**
   * Create a new user
   */
  async create(data: Partial<User>): Promise<User> {
    try {
      // Check for duplicate email
      const existingUser = await this.findByEmail(data.email!)
      if (existingUser) {
        throw new DuplicateException("User", "email")
      }

      const [newUser] = await db
        .insert(users)
        .values({
          name: data.name!,
          email: data.email!,
          phone: data.phone,
          password: data.password!, // In production, hash this!
          role: data.role || "user",
        })
        .returning()

      return this.mapToModel(newUser)
    } catch (error) {
      if (error instanceof DuplicateException) throw error
      this.handleDatabaseError(error, "create user")
    }
  }

  /**
   * Update an existing user
   */
  async update(id: number, data: Partial<User>): Promise<User> {
    try {
      await this.ensureExists(id, "User")

      // Check for duplicate email if email is being updated
      if (data.email) {
        const existingUser = await this.findByEmail(data.email)
        if (existingUser && existingUser.id !== id) {
          throw new DuplicateException("User", "email")
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning()

      return this.mapToModel(updatedUser)
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof DuplicateException
      )
        throw error
      this.handleDatabaseError(error, "update user")
    }
  }

  /**
   * Delete a user
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.ensureExists(id, "User")

      await db.delete(users).where(eq(users.id, id))
      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "delete user")
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      })

      return user ? this.mapToModel(user) : null
    } catch (error) {
      this.handleDatabaseError(error, "find user by ID")
    }
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    try {
      const allUsers = await db.query.users.findMany()
      return allUsers.map((user) => this.mapToModel(user))
    } catch (error) {
      this.handleDatabaseError(error, "find all users")
    }
  }

  /**
   * Find user by email
   * Custom method for authentication
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      return user ? this.mapToModel(user) : null
    } catch (error) {
      this.handleDatabaseError(error, "find user by email")
    }
  }

  /**
   * Find all admin users
   */
  async findAdmins(): Promise<AdminUser[]> {
    try {
      const adminUsers = await db.query.users.findMany({
        where: eq(users.role, "admin"),
      })

      return adminUsers.map((user) => this.mapToModel(user) as AdminUser)
    } catch (error) {
      this.handleDatabaseError(error, "find admin users")
    }
  }

  /**
   * Map database record to User model
   * Demonstrates Design Pattern: Factory Pattern
   * Creates appropriate User subclass based on role
   */
  private mapToModel(data: any): User {
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }

    // Factory Pattern: Create appropriate user type based on role
    if (data.role === "admin") {
      return new AdminUser(userData)
    } else {
      return new RegularUser(userData)
    }
  }
}
