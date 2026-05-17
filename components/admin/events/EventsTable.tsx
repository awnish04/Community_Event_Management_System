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
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Eye,
  CalendarPlus,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { createEvent } from "@/app/actions/events"

interface Event {
  id: number
  name: string
  description: string
  eventDate: Date
  eventTime: string
  capacity: number
  createdAt: Date
}

interface Venue {
  id: number
  name: string
  capacity: number
}

function CreateEventDialog({ venues }: { venues: Venue[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [venueId, setVenueId] = useState<string>("")
  const [venueName, setVenueName] = useState<string>("")

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
        setVenueId("")
        setVenueName("")
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (venueId) formData.set("venueId", venueId)

    startTransition(async () => {
      try {
        await createEvent(formData)
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
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to publish a new community event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ev-name">Event Name *</Label>
            <Input
              id="ev-name"
              name="name"
              placeholder="e.g. Summer Community Meetup"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-description">Description *</Label>
            <Textarea
              id="ev-description"
              name="description"
              placeholder="Describe what attendees can expect..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Date *</Label>
              <Input id="ev-date" name="eventDate" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-time">Time *</Label>
              <Input id="ev-time" name="eventTime" type="time" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-capacity">Capacity *</Label>
            <Input
              id="ev-capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 100"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-venue">
              Venue{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Select
              value={venueId}
              onValueChange={(val) => {
                setVenueId(val ?? "")
                const found = venues.find((v) => String(v.id) === val)
                if (found)
                  setVenueName(`${found.name} (cap. ${found.capacity})`)
                else setVenueName("")
              }}
            >
              <SelectTrigger id="ev-venue" className="w-full">
                <SelectValue>
                  {venueName || (
                    <span className="text-muted-foreground">
                      Select a venue...
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full">
                {venues.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No venues yet — add one first
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
                <CalendarPlus className="size-4" />
              )}
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EventsTable({
  events,
  venues = [],
}: {
  events: Event[]
  venues?: Venue[]
}) {
  const [search, setSearch] = useState("")

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Events</CardTitle>
          <CardDescription>{events.length} events total</CardDescription>
        </div>
        <CardAction>
          <CreateEventDialog venues={venues} />
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Event
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {events.length === 0
                      ? 'No events yet. Click "New Event" to create one.'
                      : "No events match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const isUpcoming = new Date(event.eventDate) > new Date()
                  return (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{event.name}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        <p>
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-xs">{event.eventTime}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                        {event.capacity}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={isUpcoming ? "default" : "secondary"}>
                          {isUpcoming ? "Upcoming" : "Past"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon-sm">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link
                                  href={`/events/${event.id}`}
                                  className="flex w-full items-center"
                                >
                                  <Eye className="mr-2 h-3.5 w-3.5" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/admin/events/${event.id}/edit`}
                                  className="flex w-full items-center"
                                >
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
