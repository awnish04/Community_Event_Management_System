import { NextRequest, NextResponse } from "next/server"

const adminAuthRoutes = [
  "/auth/admin-login",
  "/api/auth/admin-login",
  "/api/auth/admin-logout",
]
const userAuthRoutes = ["/auth/login", "/auth/register"]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("token")?.value
  const userRole = request.cookies.get("userRole")?.value
  const adminToken = request.cookies.get("adminToken")?.value
  const adminRole = request.cookies.get("adminRole")?.value

  // ── Admin routes ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    // Always allow admin login page + its API through
    if (adminAuthRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.next()
    }

    // Not authenticated at all → admin login
    if (!adminToken) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url))
    }

    // Authenticated but not admin → admin login
    if (adminRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url))
    }

    // Admin with valid token → allow through
    return NextResponse.next()
  }

  // ── User routes ─────────────────────────────────────────────────
  if (pathname.startsWith("/user")) {
    // Not authenticated → user login
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // ── Auth pages: redirect already-logged-in users ─────────────────
  if (token) {
    if (userAuthRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    }
  }

  if (adminToken) {
    if (adminAuthRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/auth/:path*"],
}
