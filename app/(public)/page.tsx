export const dynamic = "force-dynamic"

import { db } from "@/db"
import { events, venues, eventVenues } from "@/db/schema"
import { eq } from "drizzle-orm"
import { LandingClient } from "@/components/landing/LandingClient"

async function getUpcomingEvents() {
  try {
    const result = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        imageUrl: events.imageUrl,
        venueName: venues.name,
        venueAddress: venues.address,
      })
      .from(events)
      .leftJoin(eventVenues, eq(events.id, eventVenues.eventId))
      .leftJoin(venues, eq(eventVenues.venueId, venues.id))
      .orderBy(events.eventDate)
      .limit(6)

    return result.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      eventDate: e.eventDate.toISOString(),
      eventTime: e.eventTime,
      imageUrl: e.imageUrl,
      venue: {
        name: e.venueName ?? "TBA",
        address: e.venueAddress ?? undefined,
      },
    }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const eventsData = await getUpcomingEvents()
  return <LandingClient initialEvents={eventsData} />
}