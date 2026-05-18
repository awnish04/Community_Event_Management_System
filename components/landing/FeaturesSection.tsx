"use client"

import { motion } from "motion/react"
import { Puzzle, BarChart2 } from "lucide-react"

const features = [
  {
    title: "Find events you'll love",
    description:
      "Browse upcoming community events by date, venue, or activity type. Filter down to exactly what interests you and register in under a minute.",
    illustrationColor: "bg-[hsl(340,75%,95%)]",
  },
  {
    title: "Track your registrations",
    description:
      "See every event you've signed up for, check your registration status, and get instant updates if anything changes.",
    illustrationColor: "bg-[hsl(170,60%,92%)]",
  },
  {
    title: "Know what's happening",
    description:
      "See the full agenda workshops, talks, games, and more. Know exactly what's on before you commit to attending.",
    illustrationColor: "bg-[hsl(45,90%,92%)]",
  },
  {
    title: "Your events, your profile",
    description:
      "All your registrations, past and upcoming, in one place. Cancel, re-register, or explore similar events without any hassle.",
    illustrationColor: "bg-[hsl(250,60%,94%)]",
  },
]

// Real avatar URLs
const AVATAR_URLS = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=16",
]

// Logo URLs from CDN
const LOGO_URLS = [
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/slack-icon.svg",
    name: "Slack",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/zoom-icon.svg",
    name: "Zoom",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/hubspot.svg",
    name: "HubSpot",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/mailchimp-freddie.svg",
    name: "Mailchimp",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/google-calendar.svg",
    name: "Calendar",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/stripe.svg",
    name: "Stripe",
  },
]

type BentoAccents = {
  integrationCircle: string
  attendeeBorder: string
  analyticsBars: string
  analyticsAccent: string
  pageButton: string
}

function IllustrationPages({ accents }: { accents: BentoAccents }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <div className="w-[85%] overflow-hidden rounded-xl bg-white/80 shadow-lg dark:bg-card/85">
        <img
          src="/assets/event-vibe-coding-summit.jpg"
          alt="Event page preview"
          className="h-28 w-full object-cover"
        />
        <div className="space-y-2.5 p-3">
          <h4 className="truncate text-[11px] font-bold text-foreground">
            Community Tech Meetup 2026
          </h4>
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
            <span>📅 Jun 14, 2026</span>
            <span>📍 City Hall, Block B</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-16 text-[9px] text-muted-foreground">
                Venue
              </span>
              <div className="h-5 flex-1 rounded-md bg-muted" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-[9px] text-muted-foreground">
                Activity
              </span>
              <div className="h-5 flex-1 rounded-md bg-muted" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <div
              className="flex h-7 flex-1 items-center justify-center rounded-full"
              style={{ backgroundColor: accents.pageButton }}
            >
              <span className="text-[9px] font-semibold text-white">
                Register now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function IllustrationAnalytics({ accents }: { accents: BentoAccents }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <div className="w-[85%] rounded-xl bg-white/80 p-4 shadow-lg dark:bg-card/85">
        <div className="mb-3 flex items-center gap-2">
          <BarChart2
            className="h-4 w-4"
            style={{ color: accents.analyticsAccent }}
          />
          <span
            className="text-[10px] font-bold"
            style={{ color: accents.analyticsAccent }}
          >
            Registrations
          </span>
          <div
            className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: accents.analyticsBars }}
          />
          <span className="text-[9px] text-muted-foreground">Live</span>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {[40, 65, 30, 55, 80, 45, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${h}%`,
                backgroundColor: accents.analyticsBars,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span
              key={d}
              className="flex-1 text-center text-[7px] text-muted-foreground"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          {[
            { label: "Approved", val: "142", color: accents.analyticsBars },
            { label: "Pending", val: "38", color: "hsl(45,90%,55%)" },
            { label: "Cancelled", val: "11", color: "hsl(0,70%,60%)" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-lg bg-muted/50 p-1.5 text-center"
            >
              <div className="text-[10px] font-bold" style={{ color: s.color }}>
                {s.val}
              </div>
              <div className="text-[7px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IllustrationIntegrations({ accents }: { accents: BentoAccents }) {
  // Activities instead of random logos
  const activities = [
    { emoji: "🎤", name: "Talk" },
    { emoji: "🛠️", name: "Workshop" },
    { emoji: "🎮", name: "Games" },
    { emoji: "📍", name: "Venue A" },
    { emoji: "🗓️", name: "Schedule" },
    { emoji: "👥", name: "Networking" },
  ]

  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <div
        className="z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: accents.integrationCircle }}
      >
        <Puzzle className="h-8 w-8 text-white" />
      </div>
      {activities.map((act, i) => {
        const angle = ((i * 60 - 90) * Math.PI) / 180
        const r = 85
        return (
          <div
            key={i}
            className="absolute flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/80 shadow-md dark:bg-card/85"
            style={{
              left: `calc(50% + ${Math.cos(angle) * r}px - 28px)`,
              top: `calc(50% + ${Math.sin(angle) * r}px - 28px)`,
            }}
          >
            <span className="text-base leading-none">{act.emoji}</span>
            <span className="text-[7px] font-medium text-muted-foreground">
              {act.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function IllustrationAttendees({ accents }: { accents: BentoAccents }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-6">
      <div className="w-[85%] space-y-2 rounded-xl bg-white/80 p-3 shadow-lg dark:bg-card/85">
        <p className="mb-1 text-[10px] font-bold text-foreground">
          Participants
        </p>
        {[
          {
            img: AVATAR_URLS[0],
            name: "Sarah Chen",
            event: "Tech Meetup",
            status: "Approved",
            statusColor: "hsl(170,60%,45%)",
          },
          {
            img: AVATAR_URLS[1],
            name: "Marcus Williams",
            event: "Art Workshop",
            status: "Pending",
            statusColor: "hsl(45,90%,50%)",
          },
          {
            img: AVATAR_URLS[2],
            name: "Priya Patel",
            event: "Community Run",
            status: "Approved",
            statusColor: "hsl(170,60%,45%)",
          },
          {
            img: AVATAR_URLS[3],
            name: "James Liu",
            event: "Game Night",
            status: "Cancelled",
            statusColor: "hsl(0,70%,60%)",
          },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border-2"
              style={{ borderColor: accents.attendeeBorder }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold text-foreground">
                {p.name}
              </p>
              <p className="truncate text-[8px] text-muted-foreground">
                {p.event}
              </p>
            </div>
            <span
              className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-semibold"
              style={{
                color: p.statusColor,
                backgroundColor: `${p.statusColor}18`,
              }}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ILLUSTRATIONS = [
  IllustrationPages,
  IllustrationAnalytics,
  IllustrationIntegrations,
  IllustrationAttendees,
]

export function FeaturesSection({
  titleWeight,
  bentoStyle,
}: {
  titleWeight: number
  bentoStyle: number
}) {
  const bentoPresets = [
    {
      label: "Playful",
      cardBg: "bg-muted/50",
      colors: [
        "bg-[hsl(340,75%,95%)] dark:bg-[hsl(340,30%,15%)]",
        "bg-[hsl(170,60%,92%)] dark:bg-[hsl(170,30%,12%)]",
        "bg-[hsl(45,90%,92%)] dark:bg-[hsl(45,30%,12%)]",
        "bg-[hsl(250,60%,94%)] dark:bg-[hsl(250,30%,13%)]",
      ],
      accents: {
        integrationCircle: "hsl(45,80%,45%)",
        attendeeBorder: "hsl(250,60%,80%)",
        analyticsBars: "hsl(170,60%,50%)",
        analyticsAccent: "hsl(170,60%,40%)",
        pageButton: "hsl(340,75%,58%)",
      },
    },
    {
      label: "Neutral",
      cardBg: "bg-background border border-border",
      colors: ["bg-muted/40", "bg-muted/40", "bg-muted/40", "bg-muted/40"],
      accents: {
        integrationCircle: "hsl(45,90%,50%)",
        attendeeBorder: "hsl(250,65%,65%)",
        analyticsBars: "hsl(170,65%,45%)",
        analyticsAccent: "hsl(170,65%,35%)",
        pageButton: "hsl(340,80%,55%)",
      },
    },
    {
      label: "Vivid",
      cardBg: "bg-muted/50",
      colors: [
        "bg-[hsl(340,75%,90%)] dark:bg-[hsl(340,40%,18%)]",
        "bg-[hsl(170,60%,86%)] dark:bg-[hsl(170,40%,15%)]",
        "bg-[hsl(45,90%,86%)] dark:bg-[hsl(45,40%,15%)]",
        "bg-[hsl(250,60%,90%)] dark:bg-[hsl(250,40%,16%)]",
      ],
      accents: {
        integrationCircle: "hsl(45,90%,50%)",
        attendeeBorder: "hsl(250,65%,65%)",
        analyticsBars: "hsl(170,65%,45%)",
        analyticsAccent: "hsl(170,65%,35%)",
        pageButton: "hsl(340,80%,55%)",
      },
    },
  ]
  const currentPreset = bentoPresets[bentoStyle] ?? bentoPresets[0]

  return (
    <section
      id="features"
      className="border-y border-border bg-card py-20 lg:py-28"
    >
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
            Everything you need to run community events
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From event creation to participant management EventHub handles
            registrations, venues, and activities all in one place.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Top row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.slice(0, 2).map((feature, i) => {
              const Illust = ILLUSTRATIONS[i]
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex"
                >
                  <div
                    className={`h-full w-full overflow-hidden rounded-3xl ${currentPreset.cardBg} flex flex-col`}
                  >
                    <div
                      className={`${currentPreset.colors[i]} flex aspect-[4/3] items-center justify-center`}
                    >
                      <Illust accents={currentPreset.accents} />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display mb-2 text-xl font-bold tracking-[-0.01em] text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {features.slice(2).map((feature, rawI) => {
              const i = rawI + 2
              const Illust = ILLUSTRATIONS[i]
              const isWide = rawI === 0
              return (
                <motion.div
                  key={feature.title}
                  className={
                    isWide ? "flex md:col-span-3" : "flex md:col-span-2"
                  }
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div
                    className={`h-full w-full overflow-hidden rounded-3xl ${currentPreset.cardBg} flex ${isWide ? "flex-col sm:flex-row" : "flex-col"}`}
                  >
                    <div
                      className={`${currentPreset.colors[i]} ${isWide ? "aspect-[4/3] sm:aspect-auto sm:w-1/2" : "aspect-[4/3]"} relative flex flex-shrink-0 items-center justify-center`}
                    >
                      <Illust accents={currentPreset.accents} />
                    </div>
                    <div className="flex flex-col justify-center p-6">
                      <h3 className="font-display mb-2 text-xl font-bold tracking-[-0.01em] text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
