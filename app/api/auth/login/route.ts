import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { administrators, users, participants } from "@/db/schema"
import { eq } from "drizzle-orm"

// ── OOP layer imports ─────────────────────────────────────────────────────────
// User login delegates to UserService → UserRepository.
// Admin login keeps direct DB (administrators table is outside UserRepository scope).
import { userService } from "@/src/container"
import { InvalidCredentialsException } from "@/src/domain/exceptions/AppExceptions"
import { Administrator } from "@/src/domain/models/User"

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (role === "ADMIN") {
      // ── Admin login: direct DB (administrators table) ──────────────────────
      const admin = await db.query.administrators.findFirst({
        where: eq(administrators.email, normalizedEmail),
      })

      if (!admin || admin.password !== password) {
        throw new InvalidCredentialsException()
      }

      // Instantiate Administrator domain model
      // Demonstrates: Inheritance (Administrator extends User), Constructor usage
      const adminModel = new Administrator(
        admin.id,
        admin.name,
        admin.email,
        admin.phone ?? null,
        admin.createdAt
      )

      console.log(
        `[Login] Admin: ${adminModel.getInitials()} | canManageEvents: ${adminModel.canManageEvents()}`
      )

      return NextResponse.json({
        user: {
          id: String(adminModel.id),
          name: adminModel.name,
          email: adminModel.email,
          phone: adminModel.phone ?? undefined,
          role: "ADMIN" as const,
          createdAt: adminModel.createdAt.toISOString(),
        },
      })
    } else {
      // ── User login: UserService → UserRepository ───────────────────────────
      // Demonstrates: Service Layer, Repository Pattern, Dependency Injection
      const userDto = await userService.validateCredentials(
        normalizedEmail,
        password
      )

      // Password check — UserDto intentionally omits password for security.
      // Re-query just for password comparison (plain-text; bcrypt in production).
      const rawUser = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })
      if (!rawUser || rawUser.password !== password) {
        throw new InvalidCredentialsException()
      }

      // Ensure participant row exists
      const existing = await db.query.participants.findFirst({
        where: eq(participants.userId, userDto.id),
      })
      if (!existing) {
        await db.insert(participants).values({ userId: userDto.id })
      }

      return NextResponse.json({
        user: {
          id: String(userDto.id),
          name: userDto.name,
          email: userDto.email,
          phone: userDto.phone ?? undefined,
          role: "USER" as const,
          createdAt: userDto.createdAt.toISOString(),
        },
      })
    }
  } catch (err) {
    if (err instanceof InvalidCredentialsException) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode }
      )
    }
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
