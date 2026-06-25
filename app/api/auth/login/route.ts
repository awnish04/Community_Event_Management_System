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

// Cookie lifetime: 7 days in seconds
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60

/**
 * Set auth cookies on the response using server-side Set-Cookie headers.
 *
 * KEY DESIGN DECISION:
 * - Admin login sets adminRole + adminEmail + adminName cookies ONLY.
 * - User login sets userRole + userEmail + userName cookies ONLY.
 * - Neither login touches the other role's cookies.
 * - This allows admin and user to be simultaneously logged in from the
 *   same browser (different tabs) without kicking each other out.
 */
function buildAuthResponse(
  user: {
    id: string
    name: string
    email: string
    role: "ADMIN" | "USER"
    createdAt: string
  },
  status = 200
) {
  const res = NextResponse.json({ user }, { status })

  const cookieOpts = {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax" as const,
    httpOnly: false, // must be false so client JS can read for AuthContext
    secure: false,   // localhost — no HTTPS
  }

  if (user.role === "ADMIN") {
    // Set admin-specific cookies — do NOT touch userRole/userEmail/userName
    res.cookies.set("adminRole", "ADMIN", cookieOpts)
    res.cookies.set("adminEmail", user.email, cookieOpts)
    res.cookies.set("adminName", user.name, cookieOpts)
  } else {
    // Set user-specific cookies — do NOT touch adminRole/adminEmail/adminName
    res.cookies.set("userRole", "USER", cookieOpts)
    res.cookies.set("userEmail", user.email, cookieOpts)
    res.cookies.set("userName", user.name, cookieOpts)
  }

  return res
}

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
        admin.createdAt
      )

      console.log(
        `[Login] Admin: ${adminModel.getInitials()} | canManageEvents: ${adminModel.canManageEvents()}`
      )

      return buildAuthResponse({
        id: String(adminModel.id),
        name: adminModel.name,
        email: adminModel.email,
        role: "ADMIN" as const,
        createdAt: adminModel.createdAt.toISOString(),
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

      return buildAuthResponse({
        id: String(userDto.id),
        name: userDto.name,
        email: userDto.email,
        role: "USER" as const,
        createdAt: userDto.createdAt.toISOString(),
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
