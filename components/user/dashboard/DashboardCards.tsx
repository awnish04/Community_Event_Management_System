"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Ticket, CalendarCheck, CalendarClock } from "lucide-react"

interface DashboardCardsProps {
  totalRegistrations: number
  confirmedRegistrations: number
  upcomingEvents: number
  totalEvents: number
}

export function DashboardCards({
  totalRegistrations,
  confirmedRegistrations,
  upcomingEvents,
  totalEvents,
}: DashboardCardsProps) {
  const cards = [
    {
      title: "My Registrations",
      value: totalRegistrations,
      description: "Total events registered",
      icon: Ticket,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Confirmed",
      value: confirmedRegistrations,
      description: "With tickets generated",
      icon: CalendarCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      description: "Available to join",
      icon: CalendarClock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
    },
    {
      title: "Total Events",
      value: totalEvents,
      description: "In the community",
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
