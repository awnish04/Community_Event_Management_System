import { EventsTable } from "@/components/admin/events/EventsTable"
import { db } from "@/db"
import { events, venues, activities } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminEventsPage() {
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
        .select({ id: activities.id, name: activities.name, type: activities.type })
        .from(activities),
    ])

    allEvents = eventsData
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
