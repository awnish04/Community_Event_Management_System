"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createEvent } from "@/app/actions/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, CalendarPlus, Loader2 } from "lucide-react"
import Link from "next/link"

interface Venue {
  id: number
  name: string
  capacity: number
}

export function CreateEventForm({ venues }: { venues: Venue[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [venueId, setVenueId] = useState<string | null>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (venueId) formData.set("venueId", venueId)

    startTransition(async () => {
      try {
        await createEvent(formData)
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message)
        }
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Create New Event</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details to publish a new event.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Summer Community Meetup"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what attendees can expect..."
            rows={4}
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="eventDate">Date *</Label>
            <Input id="eventDate" name="eventDate" type="date" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eventTime">Time *</Label>
            <Input id="eventTime" name="eventTime" type="time" required />
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            placeholder="e.g. 100"
            required
          />
        </div>

        {/* Venue */}
        <div className="space-y-1.5">
          <Label htmlFor="venueId">Venue (optional)</Label>
          <Select
            value={venueId || ""}
            onValueChange={(value) => setVenueId(value)}
          >
            <SelectTrigger id="venueId">
              <SelectValue placeholder="Select a venue..." />
            </SelectTrigger>
            <SelectContent>
              {venues.length === 0 ? (
                <SelectItem value="_none" disabled>
                  No venues available — add one first
                </SelectItem>
              ) : (
                venues.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.name} (cap. {v.capacity})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CalendarPlus className="size-4" />
            )}
            {isPending ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  )
}
