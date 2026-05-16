import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { db } from "@/db"
import { events, venues, eventVenues, registrations, eventActivities, activities } from "@/db/schema"
import { eq, and, sql, gte, lte, inArray } from "drizzle-orm"
import { EventFilters } from "@/components/events/EventFilters"

async function getFilterData() {
  const [allVenues, allActivities] = await Promise.all([
    db.select({ id: venues.id, name: venues.name }).from(venues).orderBy(venues.name),
    db.select({ id: activities.id, name: activities.name, type: activities.type }).from(activities).orderBy(activities.name),
  ])
  return { allVenues, allActivities }
}

async function getEvents(filters: {
  search?: string
  venueId?: string
  activityType?: string
  fromDate?: string
  toDate?: string
}) {
  try {
    const conditions = []

    if (filters.venueId && filters.venueId !== "all") {
      const venueEventIds = db
        .select({ eventId: eventVenues.eventId })
        .from(eventVenues)
        .where(eq(eventVenues.venueId, parseInt(filters.venueId)))
      conditions.push(inArray(events.id, venueEventIds))
    }
    if (filters.fromDate) {
      conditions.push(gte(events.eventDate, new Date(filters.fromDate)))
    }
    if (filters.toDate) {
      conditions.push(lte(events.eventDate, new Date(filters.toDate)))
    }

    const allEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        capacity: events.capacity,
        venueName: venues.name,
        venueAddress: venues.address,
      })
      .from(events)
      .leftJoin(eventVenues, eq(events.id, eventVenues.eventId))
      .leftJoin(venues, eq(eventVenues.venueId, venues.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(events.eventDate)

    // Get registration counts
    const counts = await db
      .select({
        eventId: registrations.eventId,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(registrations)
      .where(sql`${registrations.status} IN ('pending', 'confirmed')`)
      .groupBy(registrations.eventId)
    const countMap = Object.fromEntries(counts.map((c) => [c.eventId, Number(c.count)]))

    // Filter by activity type if specified
    let eventIds: Set<number> | null = null
    if (filters.activityType && filters.activityType !== "all") {
      const matched = await db
        .select({ eventId: eventActivities.eventId })
        .from(eventActivities)
        .innerJoin(activities, eq(eventActivities.activityId, activities.id))
        .where(eq(activities.type, filters.activityType))
      eventIds = new Set(matched.map((r) => r.eventId))
    }

    let result = allEvents.map((e) => {
      const registered = countMap[e.id] ?? 0
      return {
        ...e,
        currentRegistrations: registered,
        isFull: registered >= e.capacity,
      }
    })

    // Apply activity type filter
    if (eventIds !== null) {
      result = result.filter((e) => eventIds!.has(e.id))
    }

    // Apply search filter
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      )
    }

    return result
  } catch {
    return []
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const [eventsData, filterData] = await Promise.all([
    getEvents({
      search: params.search,
      venueId: params.venue,
      activityType: params.activity,
      fromDate: params.from,
      toDate: params.to,
    }),
    getFilterData(),
  ])

  const hasFilters = params.search || params.venue || params.activity || params.from || params.to

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold">Discover Events</h1>
        <p className="text-lg text-muted-foreground">
          Find and join amazing community events happening near you
        </p>
      </div>

      {/* Filters (client component) */}
      <EventFilters
        venues={filterData.allVenues}
        activityTypes={[
          ...new Set(
            filterData.allActivities
              .map((a) => a.type)
              .filter(Boolean) as string[]
          ),
        ]}
        currentFilters={{
          search: params.search ?? "",
          venue: params.venue ?? "",
          activity: params.activity ?? "",
          from: params.from ?? "",
          to: params.to ?? "",
        }}
      />

      {/* Results count */}
      {hasFilters && (
        <p className="mb-4 text-sm text-muted-foreground">
          {eventsData.length} event{eventsData.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Events Grid */}
      {eventsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="mb-2 text-xl font-semibold">
            {hasFilters ? "No events match your filters" : "No events yet"}
          </h2>
          <p className="text-muted-foreground">
            {hasFilters
              ? "Try adjusting your search or filters."
              : "Check back soon — events will appear here once they're created."}
          </p>
          {hasFilters && (
            <Link href="/events" className="mt-4">
              <Button variant="outline">Clear filters</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventsData.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <Badge variant={event.isFull ? "destructive" : "default"}>
                    {event.isFull ? "Full" : "Available"}
                  </Badge>
                  <Badge variant="outline">
                    {event.currentRegistrations}/{event.capacity}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at {event.eventTime}
                    </span>
                  </div>
                  {event.venueName && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.venueName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.currentRegistrations} registered</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button className="w-full" disabled={event.isFull}>
                    {event.isFull ? "Event Full" : "View Details"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
