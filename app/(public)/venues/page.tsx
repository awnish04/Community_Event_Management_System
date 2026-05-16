import { db } from "@/db"
import { venues, eventVenues } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { MapPin, Users, Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Venues — EventHub",
  description: "Browse all event venues available in our community",
}

async function getVenues() {
  try {
    const allVenues = await db
      .select({
        id: venues.id,
        name: venues.name,
        address: venues.address,
        capacity: venues.capacity,
        description: venues.description,
      })
      .from(venues)
      .orderBy(venues.name)

    // Count events per venue via junction table
    const eventCounts = await db
      .select({
        venueId: eventVenues.venueId,
        count: sql<number>`count(DISTINCT ${eventVenues.eventId})`.as("count"),
      })
      .from(eventVenues)
      .groupBy(eventVenues.venueId)

    const countMap = Object.fromEntries(
      eventCounts.map((r) => [r.venueId, Number(r.count)])
    )

    return allVenues.map((v) => ({
      ...v,
      eventCount: countMap[v.id] ?? 0,
    }))
  } catch {
    return []
  }
}

export default async function VenuesPage() {
  const allVenues = await getVenues()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Venues</h1>
        <p className="text-lg text-muted-foreground">
          Explore the spaces where our community comes together
        </p>
      </div>

      {allVenues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="mb-2 text-xl font-semibold">No venues yet</h2>
          <p className="text-muted-foreground">
            Venues will appear here once they&apos;ve been added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allVenues.map((venue) => (
            <Card
              key={venue.id}
              className="flex flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  {venue.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                {venue.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {venue.description}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-3">
                  <Badge variant="secondary" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Capacity: {venue.capacity}
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {venue.eventCount} event{venue.eventCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
