"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

export function ConditionalNavigation() {
  const pathname = usePathname()

  if (pathname === "/auth/admin-login") {
    return null
  }

  return <Navigation />
}
