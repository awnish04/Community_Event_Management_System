import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { EventCard } from "@/components/EventCard"
import { SkeletonCard } from "@/components/SkeletonCard"
import { Footer } from "@/components/Footer"
import { db } from "@/db"
import { events, venues, eventVenues } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Suspense } from "react"
import { NumberTicker } from "@/components/ui/number-ticker"

async function getUpcomingEvents() {
  try {
    const result = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
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
      venue: {
        name: e.venueName ?? "TBA",
        address: e.venueAddress ?? undefined,
      },
    }))
  } catch {
    return []
  }
}

function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

async function EventsGrid() {
  const eventsData = await getUpcomingEvents()

  if (eventsData.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted p-12 text-center">
        <p className="text-muted-foreground">
          No events available yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {eventsData.slice(0, 3).map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>

      {eventsData.length >= 3 && (
        <div className="mt-10 flex justify-center">
          <Link href="/events">
            <Button size="lg" className="gap-2">
              See All Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="min-h-[420px] bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-foreground">
            Discover events happening in your community
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg">
            Find workshops, talks, meetups and activities near you. Register in
            seconds.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/events">
              <Button size="lg" className="gap-2">
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center overflow-hidden border border-border/60 bg-card shadow-sm">
            {[
              { value: 120, suffix: "+", label: "Events" },
              { value: 40, suffix: "+", label: "Venues" },
              { value: 2400, suffix: "+", label: "Members" },
            ].map(({ value, suffix, label }, i) => (
              <div
                key={label}
                className="relative flex flex-1 flex-col items-center justify-center px-6 py-4"
              >
                {i !== 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-7 w-px -translate-y-1/2 bg-border"
                  />
                )}
                <span className="flex items-baseline gap-0.5 text-2xl leading-none font-bold text-primary">
                  <NumberTicker
                    value={value}
                    className="tracking-wide text-primary tabular-nums"
                  />
                  <span>{suffix}</span>
                </span>
                <span className="mt-1 text-xs whitespace-nowrap text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-foreground">Event Calendar</h2>
            <p className="mx-auto mt-2">
              Discover amazing events happening in your community
            </p>
          </div>

          <Suspense fallback={<EventsGridSkeleton />}>
            <EventsGrid />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  )
}
