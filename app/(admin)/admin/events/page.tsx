import { EventsTable } from "@/components/admin/events/EventsTable"
import { db } from "@/db"
import { events, venues } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminEventsPage() {
  let allEvents: (typeof events.$inferSelect)[] = []
  let allVenues: { id: number; name: string; capacity: number }[] = []

  try {
    ;[allEvents, allVenues] = await Promise.all([
      db.select().from(events).orderBy(desc(events.eventDate)),
      db
        .select({ id: venues.id, name: venues.name, capacity: venues.capacity })
        .from(venues),
    ])
  } catch {
    allEvents = []
    allVenues = []
  }

  return <EventsTable events={allEvents} venues={allVenues} />
}
