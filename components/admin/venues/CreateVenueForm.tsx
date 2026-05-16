"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createVenue } from "@/app/actions/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"

export function CreateVenueForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await createVenue(formData)
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
        <Link href="/admin/venues">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Add New Venue</h1>
          <p className="text-sm text-muted-foreground">
            Register a new venue for your events.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-5"
      >
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Venue Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. City Convention Center"
            required
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            placeholder="e.g. 123 Main Street, Kathmandu"
            required
          />
        </div>

        {/* Capacity */}
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            placeholder="e.g. 200"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Any additional details about the venue..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/venues")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MapPin className="size-4" />
            )}
            {isPending ? "Saving..." : "Add Venue"}
          </Button>
        </div>
      </form>
    </div>
  )
}
