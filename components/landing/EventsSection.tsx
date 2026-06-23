"use client"

import { motion } from "motion/react"
import { useAuth } from "@/lib/context/AuthContext"
import { useRouter } from "next/navigation"

export type DatabaseEvent = {
  id: number
  name: string
  description: string | null
  eventDate: string
  eventTime: string | null
  imageUrl: string | null
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
  const { user } = useAuth()
  const router = useRouter()

  const handleEventClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      router.push("/user/events")
    } else {
      router.push("/auth/login")
    }
  }
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
      ? initialEvents.slice(0, 4).map((event) => {
          const formattedDate = new Date(event.eventDate).toLocaleDateString(
            "en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
            }
          )

          return {
            id: event.id as string | number,
            img: event.imageUrl ?? null,
            title: event.name,
            tag: event.venue?.name || "TBA",
            date: formattedDate,
          }
        })
      : defaultEvents

  return (
    <section className="py-12 pb-20 lg:py-16 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2
            className="font-display text-2xl tracking-[-0.02em] text-foreground sm:text-3xl"
            style={{ fontWeight: titleWeight }}
          >
            Popular events on eventspark
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mappedEvents.map((event, i) => {
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                  <div onClick={handleEventClick} className="group block cursor-pointer">
                    <div>
                      <div className="relative mb-3 overflow-hidden rounded-xl">
                        {event.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.img}
                            alt={event.title}
                            className="h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-[180px] w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {event.date}
                      </p>
                      <h4 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
                        {event.title}
                      </h4>
                    </div>
                  </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
