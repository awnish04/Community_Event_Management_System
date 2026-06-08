import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardCards } from "@/components/admin/dashboard/DashboardCards"
import { db } from "@/db"
import { events, users, venues, activities, registrations } from "@/db/schema"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  // Check authentication
  const cookieStore = await cookies()
  const adminRole = cookieStore.get("adminRole")?.value

  if (adminRole !== "ADMIN") {
    redirect("/auth/admin-login")
  }

  let totalEvents = 0
  let upcomingEvents = 0
  let totalUsers = 0
  let newUsersThisMonth = 0
  let totalVenues = 0
  let totalActivities = 0
  let totalRegistrations = 0
  let confirmedRegistrations = 0

  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [allEvents, allUsers, allVenues, allActivities, allRegistrations] =
      await Promise.all([
        db.select({ eventDate: events.eventDate }).from(events),
        db.select({ createdAt: users.createdAt }).from(users),
        db.select({ id: venues.id }).from(venues),
        db.select({ id: activities.id }).from(activities),
        db.select({ status: registrations.status }).from(registrations),
      ])

    totalEvents = allEvents.length
    upcomingEvents = allEvents.filter((e) => new Date(e.eventDate) > now).length
    totalUsers = allUsers.length
    newUsersThisMonth = allUsers.filter(
      (u) => new Date(u.createdAt) >= startOfMonth
    ).length
    totalVenues = allVenues.length
    totalActivities = allActivities.length
    totalRegistrations = allRegistrations.length
    confirmedRegistrations = allRegistrations.filter(
      (r) => r.status === "confirmed"
    ).length
  } catch {
    // fallback to zeros — DB may not be seeded yet
  }

  // Get current month name
  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" })

  return (
    <DashboardCards
      totalEvents={totalEvents}
      upcomingEvents={upcomingEvents}
      totalUsers={totalUsers}
      newUsersThisMonth={newUsersThisMonth}
      currentMonthName={currentMonthName}
      totalVenues={totalVenues}
      totalActivities={totalActivities}
      totalRegistrations={totalRegistrations}
      confirmedRegistrations={confirmedRegistrations}
    />
  )
}
