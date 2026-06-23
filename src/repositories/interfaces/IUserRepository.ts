import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/src/domain/dto/UserDto"

// ─── IUserRepository ──────────────────────────────────────────────────────────
// Defines the contract for all user data-access operations.

export interface IUserRepository {
  getAll(): Promise<UserDto[]>
  getById(id: number): Promise<UserDto | null>
  getByEmail(email: string): Promise<UserDto | null>
  create(data: CreateUserDto): Promise<UserDto>
  update(id: number, data: UpdateUserDto): Promise<UserDto>
  delete(id: number): Promise<void>
}
