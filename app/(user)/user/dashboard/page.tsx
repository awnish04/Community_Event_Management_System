"use client"

import { useAuth } from "@/lib/context/AuthContext"
import { SectionCards } from "@/components/admin/dashboard/section-cards"
import { useEffect, useState } from "react"
import { getUserDashboardStats } from "@/app/actions/user-dashboard"

export default function UserDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<{
    totalRegistrations: number
    pendingRegistrations: number
    upcomingEvents: number
    totalEvents: number
  } | null>(null)

  useEffect(() => {
    if (user?.email) {
      getUserDashboardStats(user.email).then((data) => {
        if (data) setStats(data)
      })
    }
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h1>
        <p className="text-muted-foreground">
          Here is an overview of your community event activity.
        </p>
      </div>

      <SectionCards
        totalEvents={stats?.totalEvents || 0}
        upcomingEvents={stats?.upcomingEvents || 0}
        totalParticipants={0}
        newParticipants={0}
        totalVenues={0}
        totalActivities={0}
        totalRegistrations={stats?.totalRegistrations || 0}
        pendingRegistrations={stats?.pendingRegistrations || 0}
      />
    </div>
  )
}
