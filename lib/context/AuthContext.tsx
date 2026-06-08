"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
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
    password: string,
    phone?: string
  ) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function setCookie(name: string, value: string, days = 1) {
  const isProduction = window.location.protocol === "https:"
  const secure = isProduction ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${
    days * 86400
  }; SameSite=Lax${secure}`
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Runs once on mount — safe to call localStorage here
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem("authUser")
      if (!stored) return null
      const parsed: User = JSON.parse(stored)
      // Re-sync cookies in case they expired (e.g. browser restart)
      setCookie("userEmail", parsed.email)
      setCookie("userName", parsed.name)
      if (parsed.role === "ADMIN") {
        setCookie("adminRole", "ADMIN")
      } else {
        setCookie("userRole", "USER")
      }
      return parsed
    } catch {
      localStorage.removeItem("authUser")
      return null
    }
  })
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
        body: JSON.stringify({ email, password, role }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      const loggedInUser: User = data.user
      setUser(loggedInUser)
      localStorage.setItem("authUser", JSON.stringify(loggedInUser))

      // Set cookies that middleware reads
      setCookie("userEmail", loggedInUser.email)
      setCookie("userName", loggedInUser.name)

      if (role === "ADMIN") {
        setCookie("adminRole", "ADMIN")
        clearCookie("userRole")
      } else {
        setCookie("userRole", "USER")
        clearCookie("adminRole")
      }

      // Small delay so cookies are written before middleware checks them
      await new Promise((r) => setTimeout(r, 50))
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
    password: string,
    phone?: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
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
    setUser(null)
    localStorage.removeItem("authUser")
    clearCookie("userEmail")
    clearCookie("userName")
    clearCookie("userRole")
    clearCookie("adminRole")
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
