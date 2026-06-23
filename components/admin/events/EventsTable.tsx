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
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  CalendarPlus,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { createEvent, editEvent, deleteEvent } from "@/app/actions/events"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ImageUploadPicker } from "./ImageUploadPicker"

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

interface Activity {
  id: number
  name: string
  type: string | null
}

function CreateEventDialog({ venues, activities }: { venues: Venue[]; activities: Activity[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [venueId, setVenueId] = useState<string>("")
  const [venueName, setVenueName] = useState<string>("")
  const [activityId, setActivityId] = useState<string>("")
  const [activityName, setActivityName] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
        setVenueId("")
        setVenueName("")
        setActivityId("")
        setActivityName("")
        setImageUrl(null)
        setIsUploadingImage(false)
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (venueId) formData.set("venueId", venueId)
    if (imageUrl) formData.set("imageUrl", imageUrl)

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
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New Event
          </Button>
        }
      />
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

          <ImageUploadPicker
            label="Event Image"
            onUploadComplete={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl(null)}
            onUploadStart={() => setIsUploadingImage(true)}
            onUploadEnd={() => setIsUploadingImage(false)}
          />

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

          <div className="space-y-1.5">
            <Label htmlFor="ev-activity-create">Activity</Label>
            <Select
              value={activityId}
              onValueChange={(val) => {
                setActivityId(val ?? "")
                const found = activities.find((a) => String(a.id) === val)
                if (found) setActivityName(found.name)
                else setActivityName("")
              }}
            >
              <SelectTrigger id="ev-activity-create" className="w-full">
                <SelectValue>
                  {activityName || (
                    <span className="text-muted-foreground">
                      Select an activity...
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="">Select an activity...</SelectItem>
                {activities.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No activities yet — add one first
                  </SelectItem>
                ) : (
                  activities.map((act) => (
                    <SelectItem key={act.id} value={String(act.id)}>
                      {act.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Hidden input to natively submit the single activityId */}
            {activityId && (
              <input type="hidden" name="activityIds" value={activityId} />
            )}
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
            <Button type="submit" disabled={isPending || isUploadingImage} className="gap-2">
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

function EditEventDialog({ event, venues, activities }: { event: any; venues: Venue[]; activities: Activity[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [venueId, setVenueId] = useState<string>("")
  const [venueName, setVenueName] = useState<string>("")
  const [activityId, setActivityId] = useState<string>("")
  const [activityName, setActivityName] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(event.imageUrl || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
      } else {
        setImageUrl(event.imageUrl || null)
        setIsUploadingImage(false)
        const currentVenueLink = (event as any).eventVenues?.[0]
        setVenueId(currentVenueLink ? String(currentVenueLink.venueId) : "")
        setVenueName(currentVenueLink?.venue ? `${currentVenueLink.venue.name} (cap. ${currentVenueLink.venue.capacity})` : "")
        
        const firstActivityLink = (event as any).eventActivities?.[0]
        setActivityId(firstActivityLink ? String(firstActivityLink.activityId) : "")
        setActivityName(firstActivityLink?.activity ? firstActivityLink.activity.name : "")
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (venueId) formData.set("venueId", venueId)
    if (imageUrl) formData.set("imageUrl", imageUrl)

    startTransition(async () => {
      try {
        await editEvent(event.id, formData)
        setOpen(false)
        router.refresh()
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  // Format date to YYYY-MM-DD for the input
  const dateStr = new Date(event.eventDate).toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Edit Event</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update details for this community event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`ev-name-${event.id}`}>Event Name *</Label>
            <Input
              id={`ev-name-${event.id}`}
              name="name"
              defaultValue={event.name}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`ev-description-${event.id}`}>Description *</Label>
            <Textarea
              id={`ev-description-${event.id}`}
              name="description"
              defaultValue={event.description}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor={`ev-date-${event.id}`}>Date *</Label>
              <Input
                id={`ev-date-${event.id}`}
                name="eventDate"
                type="date"
                defaultValue={dateStr}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`ev-time-${event.id}`}>Time *</Label>
              <Input
                id={`ev-time-${event.id}`}
                name="eventTime"
                type="time"
                defaultValue={event.eventTime}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`ev-capacity-${event.id}`}>Capacity *</Label>
            <Input
              id={`ev-capacity-${event.id}`}
              name="capacity"
              type="number"
              min="1"
              defaultValue={event.capacity}
              required
            />
          </div>

          <ImageUploadPicker
            label="Event Image"
            defaultValue={event.imageUrl || null}
            onUploadComplete={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl(null)}
            onUploadStart={() => setIsUploadingImage(true)}
            onUploadEnd={() => setIsUploadingImage(false)}
          />

          <div className="space-y-1.5">
            <Label htmlFor={`ev-venue-${event.id}`}>
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
              <SelectTrigger id={`ev-venue-${event.id}`} className="w-full">
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

          <div className="space-y-1.5">
            <Label htmlFor={`ev-activity-${event.id}`}>Activity</Label>
            <Select
              value={activityId}
              onValueChange={(val) => {
                setActivityId(val ?? "")
                const found = activities.find((a) => String(a.id) === val)
                if (found) setActivityName(found.name)
                else setActivityName("")
              }}
            >
              <SelectTrigger id={`ev-activity-${event.id}`} className="w-full">
                <SelectValue>
                  {activityName || (
                    <span className="text-muted-foreground">
                      Select an activity...
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="">Select an activity...</SelectItem>
                {activities.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No activities yet — add one first
                  </SelectItem>
                ) : (
                  activities.map((act) => (
                    <SelectItem key={act.id} value={String(act.id)}>
                      {act.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Hidden input to natively submit the single activityId */}
            {activityId && (
              <input type="hidden" name="activityIds" value={activityId} />
            )}
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
            <Button type="submit" disabled={isPending || isUploadingImage} className="gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteEventDialog({ event }: { event: Event }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteEvent(event.id)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Delete Event</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{event.name}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EventsTable({
  events,
  venues = [],
  activities = [],
}: {
  events: any[]
  venues?: Venue[]
  activities?: Activity[]
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
          <CreateEventDialog venues={venues} activities={activities} />
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
        <div className="overflow-x-auto border rounded-2xl">
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
                          <EditEventDialog event={event} venues={venues} activities={activities} />
                          <DeleteEventDialog event={event} />
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
