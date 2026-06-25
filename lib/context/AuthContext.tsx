"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (
    email: string,
    password: string,
    role: "ADMIN" | "USER"
  ) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Returns the correct localStorage key for a given role.
 * Using separate keys prevents admin login from overwriting the user session
 * and vice versa — which was the root cause of the cross-session logout bug.
 */
function storageKey(role: "ADMIN" | "USER") {
  return role === "ADMIN" ? "authAdmin" : "authUser"
}

/**
 * Reads the stored user from localStorage.
 * Tries both keys — whichever is populated is the active session.
 * This is called once on mount; cookies are set by the server on login,
 * so there is no need to touch document.cookie here.
 */
function readStoredUser(): User | null {
  if (typeof window === "undefined") return null
  for (const key of ["authUser", "authAdmin"] as const) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const parsed: User = JSON.parse(raw)
      if (parsed?.email && parsed?.role) return parsed
    } catch {
      localStorage.removeItem(key)
    }
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (
    email: string,
    password: string,
    role: "ADMIN" | "USER"
  ) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "same-origin" ensures Set-Cookie headers are applied
        credentials: "same-origin",
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      const loggedInUser: User = data.user

      // Store in role-specific key so admin and user sessions don't collide
      localStorage.setItem(storageKey(loggedInUser.role), JSON.stringify(loggedInUser))

      // Clear the OTHER role's localStorage entry to avoid stale cross-role reads
      localStorage.removeItem(storageKey(loggedInUser.role === "ADMIN" ? "USER" : "ADMIN"))

      setUser(loggedInUser)

      // Cookies are already set by the server via Set-Cookie response headers.
      // No document.cookie manipulation needed here.
      router.push(role === "ADMIN" ? "/admin" : "/user/dashboard")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed"
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      // Account created — do NOT log in automatically.
      // The register page will show a success message and redirect to login.
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed"
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    const role = user?.role ?? null

    // Clear only this role's localStorage entry
    if (role === "ADMIN") {
      localStorage.removeItem("authAdmin")
    } else if (role === "USER") {
      localStorage.removeItem("authUser")
    } else {
      // Unknown role — clear both to be safe
      localStorage.removeItem("authUser")
      localStorage.removeItem("authAdmin")
    }

    // Clear only this role's server-side cookies
    const query = role ? `?role=${role}` : ""
    fetch(`/api/auth/logout${query}`, {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => {})

    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
