"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Users,
  MapPin,
  Activity,
  Ticket,
  CalendarClock,
  UserPlus,
  CheckCircle,
} from "lucide-react"

interface DashboardCardsProps {
  totalEvents: number
  upcomingEvents: number
  totalUsers: number
  newUsersThisMonth: number
  currentMonthName: string
  totalVenues: number
  totalActivities: number
  totalRegistrations: number
  confirmedRegistrations: number
}

export function DashboardCards({
  totalEvents,
  upcomingEvents,
  totalUsers,
  newUsersThisMonth,
  currentMonthName,
  totalVenues,
  totalActivities,
  totalRegistrations,
  confirmedRegistrations,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "Total Events",
      value: totalEvents,
      description: `${upcomingEvents} upcoming`,
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users till date",
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Total Registrations",
      value: totalRegistrations,
      description: `${confirmedRegistrations} confirmed`,
      icon: Ticket,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      description: "Scheduled soon",
      icon: CalendarClock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Total Venues",
      value: totalVenues,
      description: "Available locations",
      icon: MapPin,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      title: "Total Activities",
      value: totalActivities,
      description: "Activity types",
      icon: Activity,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
    },
    {
      title: `New Users (${currentMonthName})`,
      value: newUsersThisMonth,
      description: "Registered this month",
      icon: UserPlus,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
    {
      title: "Confirmed",
      value: confirmedRegistrations,
      description: "Auto-approved",
      icon: CheckCircle,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your community event management system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-medium"
                suppressHydrationWarning
              >
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
