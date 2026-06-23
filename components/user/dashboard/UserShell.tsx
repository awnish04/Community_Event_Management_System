"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserSidebar } from "./user-sidebar"
import { UserSiteHeader } from "./user-site-header"
import type { ReactNode } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"

interface Props {
  children: ReactNode
}

export function UserShell({ children }: Props) {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && (!user || user.role !== "USER")) {
      router.replace("/auth/login")
    }
  }, [user, loading, router, mounted])

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) return null

  // Show nothing while checking auth or redirecting
  if (!user || user.role !== "USER") return null

  const sessionUser = {
    name: user.name,
    email: user.email,
    avatar: "",
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <UserSidebar variant="inset" collapsible="icon" user={sessionUser} />
      <SidebarInset>
        <UserSiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-6 py-4 md:gap-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
