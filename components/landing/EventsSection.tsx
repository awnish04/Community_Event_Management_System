"use client"

import { motion } from "motion/react"
import Link from "next/link"

type DatabaseEvent = {
  id: number
  name: string
  description: string | null
  eventDate: string
  eventTime: string | null
  venue: {
    name: string
    address?: string
  }
}

export function EventsSection({
  initialEvents,
  titleWeight,
}: {
  initialEvents: DatabaseEvent[]
  titleWeight: number
}) {
  const defaultEvents = [
    {
      id: "mock-1" as string | number,
      img: "/assets/event-hackathon-ai.jpg",
      title: "AI hackathon",
      date: "Sat, Mar 28",
    },
    {
      id: "mock-2" as string | number,
      img: "/assets/event-chill-code-workshop.jpg",
      title: "Chill code workshop",
      date: "Thu, Apr 3",
    },
    {
      id: "mock-3" as string | number,
      img: "/assets/event-startup-weekend.jpg",
      title: "Startup weekend",
      date: "Fri, Apr 11",
    },
    {
      id: "mock-4" as string | number,
      img: "/assets/event-vibe-coding-summit.jpg",
      title: "Vibe coding summit",
      date: "Sat, Apr 19",
    },
  ]

  const mappedEvents =
    initialEvents.length > 0
      ? initialEvents.slice(0, 4).map((event, i) => {
          const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          return {
            id: event.id as string | number,
            img: [
              "/assets/event-hackathon-ai.jpg",
              "/assets/event-chill-code-workshop.jpg",
              "/assets/event-startup-weekend.jpg",
              "/assets/event-vibe-coding-summit.jpg",
            ][i % 4],
            title: event.name,
            tag: event.venue?.name || "TBA",
            date: formattedDate,
          }
        })
      : defaultEvents

  return (
    <section className="py-12 lg:py-16 pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-2xl sm:text-3xl font-display text-foreground tracking-[-0.02em]"
            style={{ fontWeight: titleWeight }}
          >
            Popular events on eventspark
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mappedEvents.map((event, i) => {
            const href = "#"

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href={href} className="group block cursor-pointer">
                  <div>
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      <img
                        src={event.img}
                        alt={event.title}
                        className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                      {event.date}
                    </p>
                    <h4 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors tracking-[-0.01em]">
                      {event.title}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
