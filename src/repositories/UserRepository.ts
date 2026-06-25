import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { IUserRepository } from "./interfaces/IUserRepository"
import type {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
} from "@/src/domain/dto/UserDto"

// ─── UserRepository ───────────────────────────────────────────────────────────
// Concrete implementation of IUserRepository.
// All database access for users is isolated here.

export class UserRepository implements IUserRepository {
  async getAll(): Promise<UserDto[]> {
    return db.select().from(users)
  }

  async getById(id: number): Promise<UserDto | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    return result ?? null
  }

  async getByEmail(email: string): Promise<UserDto | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    })
    return result ?? null
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const [created] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: data.password,
      })
      .returning()
    return created
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    const [updated] = await db
      .update(users)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()
    return updated
  }

  async delete(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id))
  }
}
