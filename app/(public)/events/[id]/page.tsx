import { notFound } from "next/navigation"
import { db } from "@/db"
import {
  events,
  venues,
  eventVenues,
  registrations,
  eventActivities,
  activities,
} from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Activity,
} from "lucide-react"
import Link from "next/link"
async function getEvent(id: number) {
  try {
    const [event] = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        capacity: events.capacity,
        venueName: venues.name,
        venueAddress: venues.address,
        venueCapacity: venues.capacity,
      })
      .from(events)
      .leftJoin(eventVenues, eq(events.id, eventVenues.eventId))
      .leftJoin(venues, eq(eventVenues.venueId, venues.id))
      .where(eq(events.id, id))
      .limit(1)

    if (!event) return null

    // Registration count
    const [regResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, id),
          sql`${registrations.status} IN ('pending', 'confirmed')`
        )
      )
    const currentRegistrations = Number(regResult?.count ?? 0)

    // Activities for this event
    const eventActs = await db
      .select({ name: activities.name, type: activities.type })
      .from(eventActivities)
      .innerJoin(activities, eq(eventActivities.activityId, activities.id))
      .where(eq(eventActivities.eventId, id))

    return {
      ...event,
      currentRegistrations,
      availableSpots: event.capacity - currentRegistrations,
      isFull: currentRegistrations >= event.capacity,
      occupancyPercentage:
        event.capacity > 0 ? (currentRegistrations / event.capacity) * 100 : 0,
      activities: eventActs,
    }
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(Number(id))
  return {
    title: event ? `${event.name} — EventHub` : "Event Not Found",
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEvent(Number(id))

  if (!event) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Event Header */}
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="flex gap-2">
                <Badge variant={event.isFull ? "destructive" : "default"}>
                  {event.isFull ? "Event Full" : "Available Spots"}
                </Badge>
                <Badge variant="outline">
                  {event.currentRegistrations}/{event.capacity} Registered
                </Badge>
              </div>
              <Button render={<Link href="/auth/register" />}>
                Register for Event
              </Button>
            </div>
            <h1 className="mb-4 text-4xl font-bold">{event.name}</h1>
            <p className="text-lg text-muted-foreground">{event.description}</p>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Event Details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(event.eventDate).toLocaleDateString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{event.eventTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      {event.venueName ? (
                        <>
                          <p className="font-medium">{event.venueName}</p>
                          {event.venueAddress && (
                            <p className="text-sm text-muted-foreground">
                              {event.venueAddress}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">TBA</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">
                        {event.availableSpots} spots available
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.occupancyPercentage.toFixed(0)}% full
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Activities */}
          {event.activities.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Activities</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {event.activities.map((activity, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="mb-1 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">
                            {activity.name}
                          </CardTitle>
                        </div>
                        {activity.type && (
                          <CardDescription className="capitalize">
                            {activity.type}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
