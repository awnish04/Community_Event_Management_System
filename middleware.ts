import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const userRole = request.cookies.get("userRole")?.value
  const adminRole = request.cookies.get("adminRole")?.value

  // Protect /user/* — must be logged in as USER
  if (pathname.startsWith("/user")) {
    if (userRole !== "USER") {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect /admin/* — must be logged in as ADMIN
  if (pathname.startsWith("/admin")) {
    if (adminRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url))
    }
    return NextResponse.next()
  }

  // Redirect already-logged-in users away from auth pages
  if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url))
    }
  }

  if (pathname.startsWith("/auth/admin-login")) {
    if (adminRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/auth/:path*"],
}
