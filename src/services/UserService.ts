import type { IUserRepository } from "@/src/repositories/interfaces/IUserRepository"
import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/src/domain/dto/UserDto"
import {
  UserNotFoundException,
  DuplicateEmailException,
  InvalidCredentialsException,
} from "@/src/domain/exceptions/AppExceptions"

// ─── UserService ──────────────────────────────────────────────────────────────
// Business logic layer for users.
// Demonstrates: Dependency Injection, Encapsulation, Exception handling

export class UserService {
  // Dependency Injection
  constructor(private readonly repository: IUserRepository) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.repository.getAll()
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.repository.getById(id)
    if (!user) throw new UserNotFoundException(id)
    return user
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.repository.getByEmail(email)
    if (!user) throw new UserNotFoundException(email)
    return user
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    // Business rule: check for duplicate email before inserting
    const existing = await this.repository.getByEmail(data.email)
    if (existing) throw new DuplicateEmailException(data.email)

    return this.repository.create(data)
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<UserDto> {
    await this.getUserById(id) // throws UserNotFoundException if missing
    return this.repository.update(id, data)
  }

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id) // throws if not found
    await this.repository.delete(id)
  }

  async validateCredentials(email: string, password: string): Promise<UserDto> {
    const user = await this.repository.getByEmail(email)
    // Note: in production, compare hashed passwords with bcrypt
    if (!user) throw new InvalidCredentialsException()
    return user
  }
}
