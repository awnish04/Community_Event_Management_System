"use client"

import { motion } from "motion/react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function SocialProofSection({ titleWeight }: { titleWeight: number }) {
  const testimonials = [
    {
      quote:
        "I set up our neighbourhood cleanup event in under 10 minutes — venue, activities, capacity limit, all done. Used to take me half a day.",
      name: "Sarah Chen",
      role: "Community manager",
      avatar: "/assets/avatar-sarah.jpg",
    },
    {
      quote:
        "No more spreadsheets. I approve registrations, track cancellations, and message attendees from one screen. It's night and day.",
      name: "Marcus Williams",
      role: "Event coordinator",
      avatar: "/assets/avatar-marcus.jpg",
    },
    {
      quote:
        "Double bookings used to be my worst nightmare. Now the venue capacity system catches conflicts before they happen. Total peace of mind.",
      name: "Priya Patel",
      role: "Venue administrator",
      avatar: "/assets/avatar-priya.jpg",
    },
    {
      quote:
        "Our last meetup had the highest turnout ever. Attendees could filter by activity, register instantly, and actually showed up prepared.",
      name: "James Liu",
      role: "Tech meetup organizer",
      avatar: "https://i.pravatar.cc/300?img=33",
    },
  ]

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-display mb-4 text-3xl tracking-[-0.02em] text-foreground sm:text-4xl"
            style={{ fontWeight: titleWeight }}
          >
            Loved by organizers
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Community managers, coordinators, and venue admins rely on EventHub
            every day.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-4">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="h-full"
            >
              <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
                <div className="h-[180px] flex-shrink-0 overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.role}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-shrink-0 gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex-shrink-0">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
