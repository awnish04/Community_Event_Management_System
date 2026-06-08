import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users, participants } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    })
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      )
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: normalizedEmail,
        password, // plain-text; use bcrypt in production
        phone: phone?.trim() || null,
      })
      .returning()

    // Auto-create participant row
    await db.insert(participants).values({ userId: newUser.id })

    return NextResponse.json({
      user: {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone ?? undefined,
        role: "USER" as const,
        createdAt: newUser.createdAt.toISOString(),
      },
    })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    )
  }
}
