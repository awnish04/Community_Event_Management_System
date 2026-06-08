import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAuth(role: "USER" | "ADMIN" = "USER") {
  const cookieStore = await cookies()

  if (role === "USER") {
    const userRole = cookieStore.get("userRole")?.value
    if (userRole !== "USER") {
      redirect("/auth/login")
    }
  } else if (role === "ADMIN") {
    const adminRole = cookieStore.get("adminRole")?.value
    if (adminRole !== "ADMIN") {
      redirect("/auth/admin-login")
    }
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("userEmail")?.value
  const userName = cookieStore.get("userName")?.value
  const userRole = cookieStore.get("userRole")?.value
  const adminRole = cookieStore.get("adminRole")?.value

  if (userRole === "USER" && userEmail && userName) {
    return {
      email: userEmail,
      name: userName,
      role: "USER" as const,
    }
  }

  if (adminRole === "ADMIN" && userEmail && userName) {
    return {
      email: userEmail,
      name: userName,
      role: "ADMIN" as const,
    }
  }

  return null
}
