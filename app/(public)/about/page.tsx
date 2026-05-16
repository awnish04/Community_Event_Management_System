import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Footer } from "@/components/Footer"

const STEPS = [
  {
    step: "1",
    title: "Browse events",
    description:
      "Find events by date, venue, or activity type. Filter to discover exactly what you're looking for.",
  },
  {
    step: "2",
    title: "Register instantly",
    description:
      "One click to register for an event. Confirmation is sent to your email immediately.",
  },
  {
    step: "3",
    title: "Show up and connect",
    description: "Meet people, join activities, and be part of your community.",
  },
]

const FEATURES = [
  {
    title: "Event Management",
    description:
      "Create and manage events with ease. Set dates, venues, capacity, and activities all in one place.",
  },
  {
    title: "User Registration",
    description:
      "Simple registration process for attendees. Track registrations and manage waitlists automatically.",
  },
  {
    title: "Venue & Activities",
    description:
      "Manage multiple venues and activities. Organize workshops, talks, games, and networking sessions.",
  },
  {
    title: "Role-Based Access",
    description:
      "Secure admin panel for organizers. Control who can create and manage events with role-based permissions.",
  },
  {
    title: "GraphQL API",
    description:
      "Modern GraphQL API for flexible data fetching. Type-safe queries and mutations for all operations.",
  },
  {
    title: "Real-time Updates",
    description:
      "Get instant updates on event capacity, registrations, and changes. Never miss important information.",
  },
]

const STATS = [
  { value: "120+", label: "Total Events" },
  { value: "40+", label: "Venues" },
  { value: "15+", label: "Activities" },
  { value: "2,400+", label: "Members" },
]

const WHY = [
  "Easy event discovery with powerful filtering",
  "One-click registration and instant confirmation",
  "Manage your registrations in one place",
  "Support for multiple venues and activity types",
  "Admin dashboard for event organizers",
  "Dark mode support for comfortable browsing",
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mission */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-foreground">About EventHub</h1>
          <div className="mt-8 space-y-4">
            <p>
              EventHub is a community event management platform designed to
              bring people together. We believe that local events create
              meaningful connections and strengthen communities.
            </p>
            <p>
              Our platform makes it simple for anyone to discover events
              happening near them, register in seconds, and connect with
              like-minded people in their community.
            </p>
            <p>
              Whether you&lsquo;re looking for workshops, talks, meetups, or
              social gatherings, EventHub helps you find and participate in
              events that matter to you.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-foreground">How it works</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map(({ step, title, description }) => (
              <Card key={step}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                    {step}
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-foreground">
              Everything you need to manage events
            </h2>
            <p className="mt-3">
              Powerful features to create, manage, and attend community events
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <Card key={label}>
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-semibold text-primary">
                    {value}
                  </div>
                  <p className="mt-1 text-xs">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why EventHub */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-foreground">Why choose EventHub?</h2>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((item) => (
              <Card key={item}>
                <CardContent className="flex items-start gap-3 py-1">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-muted-foreground">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground">Ready to join?</h2>
          <p className="mt-4">
            Start discovering and attending community events today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <Button size="lg">Browse Events</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
