/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { EventsTable } from "@/components/admin/events/EventsTable"
import { db } from "@/db"
import { events, venues, activities, registrations } from "@/db/schema"
import { desc, sql, eq } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
  // Check authentication
  const cookieStore = await cookies()
  const adminRole = cookieStore.get("adminRole")?.value

  if (adminRole !== "ADMIN") {
    redirect("/auth/admin-login")
  }

  let allEvents: any[] = []
  let allVenues: { id: number; name: string; capacity: number }[] = []
  let allActivities: { id: number; name: string; type: string | null }[] = []

  try {
    const [eventsData, venuesData, activitiesData] = await Promise.all([
      db.query.events.findMany({
        orderBy: [desc(events.eventDate)],
        with: {
          eventVenues: {
            with: {
              venue: true,
            },
          },
          eventActivities: {
            with: {
              activity: true,
            },
          },
        },
      }),
      db
        .select({ id: venues.id, name: venues.name, capacity: venues.capacity })
        .from(venues),
      db
        .select({
          id: activities.id,
          name: activities.name,
          type: activities.type,
        })
        .from(activities),
    ])

    allEvents = eventsData

    // Fetch registration counts
    const counts = await db
      .select({
        eventId: registrations.eventId,
        count: sql<number>`sum(quantity)`.as("count"),
      })
      .from(registrations)
      .where(sql`${registrations.status} IN ('pending', 'confirmed')`)
      .groupBy(registrations.eventId)
      
    const countMap = Object.fromEntries(
      counts.map((c) => [c.eventId, Number(c.count)])
    )

    allEvents = allEvents.map(e => ({
      ...e,
      currentRegistrations: countMap[e.id] ?? 0
    }))

    allVenues = venuesData
    allActivities = activitiesData
  } catch (err) {
    console.error("Error loading admin events page:", err)
    allEvents = []
    allVenues = []
    allActivities = []
  }

  return (
    <EventsTable
      events={allEvents}
      venues={allVenues}
      activities={allActivities}
    />
  )
}
