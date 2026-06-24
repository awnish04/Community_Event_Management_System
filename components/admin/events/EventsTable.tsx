"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
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
  ChevronDown,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react"

import { createEvent, editEvent, deleteEvent, cancelEvent } from "@/app/actions/events"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ImageUploadPicker } from "./ImageUploadPicker"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"

interface Event {
  id: number
  name: string
  description: string
  eventDate: Date
  eventTime: string
  capacity: number
  currentRegistrations: number
  imageUrl: string | null
  status: string
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
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("10:00")
  const [venueId, setVenueId] = useState<string>("")
  const [venueName, setVenueName] = useState<string>("")
  const [venueCapacity, setVenueCapacity] = useState<number | null>(null)
  const [activityId, setActivityId] = useState<string>("")
  const [activityName, setActivityName] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  function clearFieldError(field: string) {
    setFormErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  function validateCreate(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {}
    const name = (formData.get("name") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    if (!name) errors.name = "Event name is required"
    else if (name.length < 3) errors.name = "Name must be at least 3 characters"
    if (!description) errors.description = "Description is required"
    else if (description.length < 10) errors.description = "Description must be at least 10 characters"
    if (!selectedDate) errors.date = "Please select an event date"
    else if (selectedDate < new Date(new Date().setHours(0,0,0,0))) errors.date = "Event date must be in the future"
    if (!selectedTime) errors.time = "Please select an event time"
    return errors
  }

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
        setFormErrors({})
        setDatePickerOpen(false)
        setSelectedDate(undefined)
        setSelectedTime("10:00")
        setVenueId("")
        setVenueName("")
        setVenueCapacity(null)
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
    const errors = validateCreate(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
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
              autoFocus
              onChange={() => clearFieldError("name")}
              className={
                formErrors.name
                  ? "border-destructive ring-1 ring-destructive"
                  : ""
              }
            />
            {formErrors.name && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ev-description">Description *</Label>
            <Textarea
              id="ev-description"
              name="description"
              placeholder="Describe what attendees can expect..."
              rows={3}
              onChange={() => clearFieldError("description")}
              className={
                formErrors.description
                  ? "border-destructive ring-1 ring-destructive"
                  : ""
              }
            />
            {formErrors.description && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Hidden inputs submitted to server action */}
          {selectedDate && (
            <input
              type="hidden"
              name="eventDate"
              value={format(selectedDate, "yyyy-MM-dd")}
            />
          )}
          <input type="hidden" name="eventTime" value={selectedTime} />

          <div className="grid grid-cols-2 gap-4">
            {/* Date picker */}
            <div className="min-w-0 space-y-1.5">
              <Label>Date *</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      id="ev-date"
                      className={`w-full justify-between font-normal ${formErrors.date ? "border-destructive ring-1 ring-destructive" : ""}`}
                    />
                  }
                >
                  {selectedDate ? (
                    format(selectedDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    defaultMonth={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d)
                      setDatePickerOpen(false)
                      clearFieldError("date")
                    }}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {formErrors.date}
                </p>
              )}
            </div>

            {/* Time picker */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="ev-time-create">Time *</Label>
              <div className="relative w-full">
                <Clock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  id="ev-time-create"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value)
                    clearFieldError("time")
                  }}
                  className="w-full appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  required
                />
              </div>
              {formErrors.time && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {formErrors.time}
                </p>
              )}
            </div>
          </div>

          {venueCapacity !== null && (
            <input type="hidden" name="capacity" value={venueCapacity} />
          )}

          <ImageUploadPicker
            label="Event Image"
            onUploadComplete={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl(null)}
            onUploadStart={() => setIsUploadingImage(true)}
            onUploadEnd={() => setIsUploadingImage(false)}
          />

          {/* Venue + Capacity as an attached button-group row */}
          <div className="space-y-1.5">
            <Label htmlFor="ev-venue">
              Venue{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <ButtonGroup className="w-full">
              <Select
                value={venueId}
                onValueChange={(val) => {
                  setVenueId(val ?? "")
                  const found = venues.find((v) => String(v.id) === val)
                  if (found) {
                    setVenueName(found.name)
                    setVenueCapacity(found.capacity)
                  } else {
                    setVenueName("")
                    setVenueCapacity(null)
                  }
                }}
              >
                <SelectTrigger id="ev-venue" className="flex-1 rounded-r-none">
                  <SelectValue>
                    {venueName || (
                      <span className="text-muted-foreground">Select a venue...</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
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
              <ButtonGroupText className="shrink-0 rounded-l-none border-l-0 px-4 text-sm font-semibold">
                {venueCapacity !== null ? `${venueCapacity} seats` : "— seats"}
              </ButtonGroupText>
            </ButtonGroup>
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
            <Button
              type="submit"
              disabled={isPending || isUploadingImage}
              className="gap-2"
            >
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [venueId, setVenueId] = useState<string>("")
  const [venueName, setVenueName] = useState<string>("")
  const [venueCapacity, setVenueCapacity] = useState<number | null>(null)
  const [activityId, setActivityId] = useState<string>("")
  const [activityName, setActivityName] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(event.imageUrl || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("10:00")

  function clearFieldError(field: string) {
    setFormErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  function validateEdit(formData: FormData): Record<string, string> {
    const errors: Record<string, string> = {}
    const name = (formData.get("name") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    if (!name) errors.name = "Event name is required"
    else if (name.length < 3) errors.name = "Name must be at least 3 characters"
    if (!description) errors.description = "Description is required"
    else if (description.length < 10) errors.description = "Description must be at least 10 characters"
    if (!selectedDate) errors.date = "Please select an event date"
    if (!selectedTime) errors.time = "Please select an event time"
    return errors
  }

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
        setFormErrors({})
        setDatePickerOpen(false)
      } else {
        setImageUrl(event.imageUrl || null)
        setIsUploadingImage(false)
        // Pre-populate date and time from event
        setSelectedDate(new Date(event.eventDate))
        setSelectedTime(event.eventTime || "10:00")
        const currentVenueLink = (event as any).eventVenues?.[0]
        setVenueId(currentVenueLink ? String(currentVenueLink.venueId) : "")
        setVenueName(currentVenueLink?.venue ? currentVenueLink.venue.name : "")
        setVenueCapacity(currentVenueLink?.venue ? currentVenueLink.venue.capacity : null)
        
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
    const errors = validateEdit(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
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
              onChange={() => clearFieldError("name")}
              className={formErrors.name ? "border-destructive ring-1 ring-destructive" : ""}
            />
            {formErrors.name && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`ev-description-${event.id}`}>Description *</Label>
            <Textarea
              id={`ev-description-${event.id}`}
              name="description"
              defaultValue={event.description}
              rows={3}
              onChange={() => clearFieldError("description")}
              className={formErrors.description ? "border-destructive ring-1 ring-destructive" : ""}
            />
            {formErrors.description && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Hidden inputs submitted to server action */}
          {selectedDate && (
            <input
              type="hidden"
              name="eventDate"
              value={format(selectedDate, "yyyy-MM-dd")}
            />
          )}
          <input type="hidden" name="eventTime" value={selectedTime} />

          <div className="grid grid-cols-2 gap-4">
            {/* Date picker */}
            <div className="min-w-0 space-y-1.5">
              <Label>Date *</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      id={`ev-date-${event.id}`}
                      className={`w-full justify-between font-normal ${formErrors.date ? "border-destructive ring-1 ring-destructive" : ""}`}
                    />
                  }
                >
                  {selectedDate ? (
                    format(selectedDate, "MMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    defaultMonth={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d)
                      setDatePickerOpen(false)
                      clearFieldError("date")
                    }}
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {formErrors.date}
                </p>
              )}
            </div>

            {/* Time picker */}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor={`ev-time-${event.id}`}>Time *</Label>
              <div className="relative w-full">
                <Clock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  id={`ev-time-${event.id}`}
                  value={selectedTime}
                  onChange={(e) => { setSelectedTime(e.target.value); clearFieldError("time") }}
                  className="w-full appearance-none pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  required
                />
              </div>
              {formErrors.time && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {formErrors.time}
                </p>
              )}
            </div>
          </div>

          {/* Capacity is auto-derived from the selected venue */}
          {venueCapacity !== null && (
            <input type="hidden" name="capacity" value={venueCapacity} />
          )}

          <ImageUploadPicker
            label="Event Image"
            defaultValue={event.imageUrl || null}
            onUploadComplete={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl(null)}
            onUploadStart={() => setIsUploadingImage(true)}
            onUploadEnd={() => setIsUploadingImage(false)}
          />

          {/* Venue + Capacity as an attached button-group row */}
          <div className="space-y-1.5">
            <Label htmlFor={`ev-venue-${event.id}`}>
              Venue{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <ButtonGroup className="w-full">
              <Select
                value={venueId}
                onValueChange={(val) => {
                  setVenueId(val ?? "")
                  const found = venues.find((v) => String(v.id) === val)
                  if (found) {
                    setVenueName(found.name)
                    setVenueCapacity(found.capacity)
                  } else {
                    setVenueName("")
                    setVenueCapacity(null)
                  }
                }}
              >
                <SelectTrigger id={`ev-venue-${event.id}`} className="flex-1 rounded-r-none">
                  <SelectValue>
                    {venueName || (
                      <span className="text-muted-foreground">Select a venue...</span>
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
              <ButtonGroupText className="shrink-0 rounded-l-none border-l-0 px-4 text-sm font-semibold">
                {venueCapacity !== null ? `${venueCapacity} seats` : "— seats"}
              </ButtonGroupText>
            </ButtonGroup>
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

function CancelEventDialog({ event }: { event: Event }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleCancel() {
    startTransition(async () => {
      await cancelEvent(event.id)
      setOpen(false)
      router.refresh()
    })
  }

  // Hide if already cancelled
  if (event.status === "cancelled") return null

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
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Cancel Event</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-600">Cancel Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel <strong>{event.name}</strong>? This will notify all registered participants and prevent further registrations. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Keep Event
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isPending ? "Cancelling..." : "Yes, Cancel Event"}
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12 hidden md:table-cell">
                  Image
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Event
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Venues
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Activities
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
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
                    colSpan={9}
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
                      <td className="hidden px-4 py-3 md:table-cell">
                        {event.imageUrl ? (
                          <div className="h-10 w-10 overflow-hidden rounded-md border">
                            <img src={event.imageUrl} alt={event.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                            <CalendarPlus className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {event.name}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(event as any).eventVenues?.map((ev: any) => (
                            <Badge
                              key={ev.venue.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {ev.venue.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(event as any).eventActivities?.map((ea: any) => (
                            <Badge
                              key={ea.activity.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ea.activity.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {event.eventTime}
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground xl:table-cell">
                        {new Date(event.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {event.currentRegistrations} / {event.capacity}
                      </td>
                      <td className="px-4 py-3">
                        {event.status === "cancelled" ? (
                          <Badge variant="destructive">Cancelled</Badge>
                        ) : (
                          <Badge variant={isUpcoming ? "default" : "secondary"}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <EditEventDialog event={event} venues={venues} activities={activities} />
                          <CancelEventDialog event={event} />
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
