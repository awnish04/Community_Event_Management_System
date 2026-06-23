// ─── Data Transfer Objects for User ──────────────────────────────────────────

export interface CreateUserDto {
  name: string
  email: string
  password: string
  phone?: string | null
}

export interface UpdateUserDto {
  name?: string
  phone?: string | null
}

export interface UserDto {
  id: number
  name: string
  email: string
  phone?: string | null
  createdAt: Date
}
