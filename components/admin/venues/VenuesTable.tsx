"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Loader2,
} from "lucide-react"
import { createVenue } from "@/app/actions/events"

interface Venue {
  id: number
  name: string
  address: string
  capacity: number
  description: string | null
  createdAt: Date
}

function CreateVenueDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await createVenue(formData)
        setOpen(false)
        router.refresh()
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Venue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogDescription>
            Register a new venue to use for community events.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="vn-name">Venue Name *</Label>
            <Input
              id="vn-name"
              name="name"
              placeholder="e.g. City Convention Center"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-address">Address *</Label>
            <Input
              id="vn-address"
              name="address"
              placeholder="e.g. 123 Main Street, Kathmandu"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-capacity">Capacity *</Label>
            <Input
              id="vn-capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="vn-description"
              name="description"
              placeholder="Any additional details about the venue..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function VenuesTable({ venues }: { venues: Venue[] }) {
  const [search, setSearch] = useState("")

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Venues</CardTitle>
          <CardDescription>{venues.length} venues available</CardDescription>
        </div>
        <CardAction>
          <CreateVenueDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              {venues.length === 0
                ? 'No venues yet. Click "Add Venue" to create one.'
                : "No venues match your search."}
            </p>
          ) : (
            filtered.map((venue) => (
              <div
                key={venue.id}
                className="group rounded-xl border bg-card p-4 shadow-xs ring-1 ring-foreground/5 transition-all hover:ring-[var(--sidebar-primary)]/30"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-primary)]/10">
                    <MapPin className="h-4 w-4 text-[var(--sidebar-primary)]" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-semibold">{venue.name}</h3>
                <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
                  {venue.address}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    Capacity:{" "}
                    <span className="font-medium text-foreground">
                      {venue.capacity}
                    </span>
                  </span>
                </div>
                {venue.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {venue.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
