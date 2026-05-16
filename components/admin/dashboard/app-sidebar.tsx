"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Calendar,
  Users,
  MapPin,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { NavUser } from "./nav-user"

const navItems: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Participants", url: "/admin/participants", icon: Users },
  { title: "Venues", url: "/admin/venues", icon: MapPin },
  { title: "Activities", url: "/admin/activities", icon: Activity },
]

type UserProp = { name: string; email: string; avatar: string }

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: UserProp }) {
  const pathname = usePathname()

  const resolvedUser: UserProp = user ?? {
    name: "Admin User",
    email: "admin@eventhub.com",
    avatar: "",
  }

  return (
    <Sidebar {...props}>
      {/* Logo */}
      <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
            <Calendar className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="truncate text-base font-semibold text-foreground group-data-[collapsible=icon]:hidden">
            EventHub
          </span>
        </Link>
      </SidebarHeader>

      {/* Main Nav */}
      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/admin" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className={
                    isActive
                      ? "bg-primary! text-white! hover:bg-primary/90! hover:text-white! [&>svg]:text-white!"
                      : "hover:bg-sidebar-accent"
                  }
                  onClick={() => {
                    window.location.href = item.url
                  }}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: Settings + User */}
      <SidebarFooter className="px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/admin/settings"}
              tooltip="Settings"
              className={
                pathname === "/admin/settings"
                  ? "bg-primary! text-white! hover:bg-primary/90! hover:text-white! [&>svg]:text-white!"
                  : "hover:bg-sidebar-accent"
              }
              onClick={() => {
                window.location.href = "/admin/settings"
              }}
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={resolvedUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
