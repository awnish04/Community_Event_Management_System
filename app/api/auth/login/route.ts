import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { administrators, users, participants } from "@/db/schema"
import { eq } from "drizzle-orm"

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
      // ── Admin login: check administrators table ──
      const admin = await db.query.administrators.findFirst({
        where: eq(administrators.email, normalizedEmail),
      })

      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { error: "Invalid admin credentials." },
          { status: 401 }
        )
      }

      return NextResponse.json({
        user: {
          id: String(admin.id),
          name: admin.name,
          email: admin.email,
          phone: admin.phone ?? undefined,
          role: "ADMIN" as const,
          createdAt: admin.createdAt.toISOString(),
        },
      })
    } else {
      // ── User login: check users table ──
      const user = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })

      if (!user || user.password !== password) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        )
      }

      // Ensure participant row exists
      const existing = await db.query.participants.findFirst({
        where: eq(participants.userId, user.id),
      })
      if (!existing) {
        await db.insert(participants).values({ userId: user.id })
      }

      return NextResponse.json({
        user: {
          id: String(user.id),
          name: user.name,
          email: user.email,
          phone: user.phone ?? undefined,
          role: "USER" as const,
          createdAt: user.createdAt.toISOString(),
        },
      })
    }
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
