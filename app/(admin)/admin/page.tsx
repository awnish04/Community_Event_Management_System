import { SectionCards } from "@/components/admin/dashboard/section-cards"
import { db } from "@/db"
import { events, users, venues, activities, registrations } from "@/db/schema"

export default async function AdminDashboardPage() {
  let totalEvents = 0
  let upcomingEvents = 0
  let totalParticipants = 0
  let newParticipants = 0
  let totalVenues = 0
  let totalActivities = 0
  let totalRegistrations = 0
  let pendingRegistrations = 0

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
    totalParticipants = allUsers.length
    newParticipants = allUsers.filter(
      (u) => new Date(u.createdAt) >= startOfMonth
    ).length
    totalVenues = allVenues.length
    totalActivities = allActivities.length
    totalRegistrations = allRegistrations.length
    pendingRegistrations = allRegistrations.filter(
      (r) => r.status === "pending"
    ).length
  } catch {
    // fallback to zeros — DB may not be seeded yet
  }

  return (
    <SectionCards
      totalEvents={totalEvents}
      upcomingEvents={upcomingEvents}
      totalParticipants={totalParticipants}
      newParticipants={newParticipants}
      totalVenues={totalVenues}
      totalActivities={totalActivities}
      totalRegistrations={totalRegistrations}
      pendingRegistrations={pendingRegistrations}
    />
  )
}
