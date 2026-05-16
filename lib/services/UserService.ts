/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRepository } from "../repositories/UserRepository"
import { User, AdminUser, RegularUser } from "../models/User"
import {
  ValidationException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/BaseException"

/**
 * User Service
 * Demonstrates Design Pattern: Service Layer Pattern
 * Purpose: Handles user authentication and management business logic
 */
export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  /**
   * Register a new user
   * Demonstrates: Business logic for user registration
   */
  async registerUser(userData: {
    name: string
    email: string
    phone?: string
    password: string
    role?: "admin" | "user"
  }): Promise<User> {
    // Create user model for validation
    const user = new RegularUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    })

    // Validate user data
    const validationResult = await user.validate()
    if (!validationResult.isValid) {
      throw new ValidationException(
        "User validation failed",
        validationResult.errors
      )
    }

    // In production, hash the password here
    // const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user in database
    return await this.userRepository.create({
      ...userData,
      role: (userData.role || "user") as any,
    })
  }

  /**
   * Authenticate user
   * Demonstrates: Business logic for authentication
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedException("Invalid email or password")
    }

    // In production, compare hashed passwords
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = user.password === password

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password")
    }

    return user
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException("User", id)
    }
    return user
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new NotFoundException("User")
    }
    return user
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll()
  }

  /**
   * Update user profile
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new NotFoundException("User", id)
    }

    return await this.userRepository.update(id, userData)
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id)
  }

  /**
   * Get all admin users
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    return await this.userRepository.findAdmins()
  }

  /**
   * Check if user has permission
   * Demonstrates: Authorization logic
   */
  async checkPermission(userId: number, permission: string): Promise<boolean> {
    const user = await this.getUserById(userId)
    const permissions = user.getPermissions()
    return permissions.includes(permission)
  }

  /**
   * Promote user to admin
   * Demonstrates: Business logic for role management
   */
  async promoteToAdmin(userId: number): Promise<User> {
    const user = await this.getUserById(userId)

    if (user.isAdmin()) {
      throw new ValidationException("User is already an admin")
    }

    return await this.userRepository.update(userId, { role: "admin" as any })
  }

  /**
   * Demote admin to regular user
   */
  async demoteToUser(userId: number): Promise<User> {
    const user = await this.getUserById(userId)

    if (!user.isAdmin()) {
      throw new ValidationException("User is not an admin")
    }

    return await this.userRepository.update(userId, { role: "user" as any })
  }
}
