import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/auth/logout?role=USER|ADMIN
 * Clears only the cookies for the given role, leaving the other role intact.
 * This allows admin and user to be independently logged out without affecting
 * each other's session.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role") // "USER" | "ADMIN" | null (clear both)

  const res = NextResponse.json({ ok: true })

  const clearOpts = {
    path: "/",
    maxAge: 0,
    sameSite: "lax" as const,
    httpOnly: false,
  }

  if (!role || role === "USER") {
    res.cookies.set("userRole", "", clearOpts)
    res.cookies.set("userEmail", "", clearOpts)
    res.cookies.set("userName", "", clearOpts)
  }

  if (!role || role === "ADMIN") {
    res.cookies.set("adminRole", "", clearOpts)
    res.cookies.set("adminEmail", "", clearOpts)
    res.cookies.set("adminName", "", clearOpts)
  }

  return res
}
