"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/user/dashboard": "Dashboard",
  "/user/events": "Discover Events",
  "/user/registrations": "My Registrations",
}

export function UserSiteHeader() {
  const pathname = usePathname()

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) =>
      pathname.startsWith(key + "/")
    )?.[1] ??
    "User"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        />
        <span className="text-lg font-bold text-foreground">{title}</span>
      </div>
    </header>
  )
}
