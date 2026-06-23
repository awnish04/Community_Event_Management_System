"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronUp,
  Home,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"

interface UserMenuProps {
  /** "avatar" (default) — small avatar button used in desktop navbar
   *  "card" — full-width card row used in mobile menu or sidebar */
  variant?: "avatar" | "card"
}

export function UserMenu({ variant = "avatar" }: UserMenuProps) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSignOut = async () => {
    logout()
    toast.success("Signed out successfully")
  }

  // Fallback to empty strings if user is null
  const name = user?.name || "User"
  const email = user?.email || ""
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  const close = () => setOpen(false)

  // Dropdown position: above for card variant (mobile/sidebar), below for avatar (desktop)
  const dropdownClass =
    variant === "card"
      ? "absolute bottom-full left-0 right-0 mb-1 z-50 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
      : "absolute right-0 top-10 z-50 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden"

  return (
    <div ref={ref} className="relative flex w-full items-center">
      {variant === "card" ? (
        /* ── Card trigger (mobile menu or sidebar) ── */
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={open}
          className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
        >
          <Avatar className="size-7 shrink-0" suppressHydrationWarning>
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
              {mounted ? initials : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <span className="w-full truncate text-left text-xs font-semibold text-foreground">
              {mounted ? name : "User"}
            </span>
            <span className="w-full truncate text-left text-[10px] text-muted-foreground">
              {mounted ? email : ""}
            </span>
          </div>
          <ChevronUp
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
            aria-hidden
          />
        </button>
      ) : (
        /* ── Avatar trigger (desktop navbar) ── */
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="User menu"
        >
          <Avatar
            className="size-8 cursor-pointer ring-2 ring-primary/20 transition-all hover:ring-primary/50"
            suppressHydrationWarning
          >
            <AvatarImage src="" alt={name} />
            <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
              {mounted ? initials : "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      )}

      {/* ── Dropdown menu ── */}
      {open && mounted && (
        <div className={dropdownClass}>
          {/* User info header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Avatar className="size-8" suppressHydrationWarning>
              <AvatarImage src="" alt={name} />
              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-semibold text-foreground">
                {name}
              </p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="py-1">
            <Link
              href="/"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Home className="size-4 text-muted-foreground" />
              Back to Home
            </Link>
          </div>
          {/* Sign out */}
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
