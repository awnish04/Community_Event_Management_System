"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RegisterForm } from "@/components/events/RegisterForm"

interface UserEventsViewProps {
  initialEvents: any[]
}

export function UserEventsView({ initialEvents }: UserEventsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVenue, setSelectedVenue] = useState<string | null>("")
  const [selectedActivityType, setSelectedActivityType] = useState<
    string | null
  >("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [filteredEvents, setFilteredEvents] = useState<any[]>(initialEvents)
  const [openDialogId, setOpenDialogId] = useState<number | null>(null)

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = initialEvents

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (
      selectedVenue &&
      selectedVenue !== "all-venues" &&
      selectedVenue !== "_all"
    ) {
      filtered = filtered.filter(
        (event) => event.venue.name === selectedVenue
      )
    }

    if (
      selectedActivityType &&
      selectedActivityType !== "all-activities" &&
      selectedActivityType !== "_all"
    ) {
      filtered = filtered.filter((event) =>
        event.activities.some(
          (activity: any) => activity.name === selectedActivityType
        )
      )
    }

    if (selectedDate) {
      filtered = filtered.filter((event) => event.eventDate === selectedDate)
    }

    setFilteredEvents(filtered)
  }, [
    searchTerm,
    selectedVenue,
    selectedActivityType,
    selectedDate,
    initialEvents,
  ])

  const uniqueVenues = Array.from(
    new Map(initialEvents.map((e) => [e.venue.id, e.venue])).values()
  )

  const uniqueActivityNames = Array.from(
    new Set(
      initialEvents
        .flatMap((e) => e.activities?.map((a: any) => a.name) || [])
        .filter((name): name is string => typeof name === "string" && name.trim() !== "")
    )
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex">
              <Filter className="h-5 w-5" />
              Filter Events
            </div>
            <div>
              {(searchTerm ||
                (selectedVenue &&
                  selectedVenue !== "all-venues" &&
                  selectedVenue !== "_all") ||
                (selectedActivityType &&
                  selectedActivityType !== "all-activities" &&
                  selectedActivityType !== "_all") ||
                selectedDate) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedVenue("")
                    setSelectedActivityType("")
                    setSelectedDate("")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Events</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>

              <Select
                value={selectedVenue || ""}
                onValueChange={(value) => setSelectedVenue(value)}
              >
                <SelectTrigger id="venue" className="w-full">
                  <SelectValue placeholder="All Venues" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="">All Venues</SelectItem>

                  {uniqueVenues.map((venue: any) => (
                    <SelectItem key={venue.id} value={venue.name}>
                      {venue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>

              <Select
                value={selectedActivityType || ""}
                onValueChange={(value) => setSelectedActivityType(value)}
              >
                <SelectTrigger id="activity" className="w-full">
                  <SelectValue placeholder="All Activities" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="">All Activities</SelectItem>

                  {uniqueActivityNames.map((name: string) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col shadow-sm transition-all hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </div>
                  {event.userRegistrationStatus && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 capitalize font-semibold px-2.5 py-0.5 rounded-full border shadow-none",
                        event.userRegistrationStatus === "confirmed"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50"
                          : event.userRegistrationStatus === "cancelled"
                            ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/50"
                            : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50"
                      )}
                    >
                      {event.userRegistrationStatus === "confirmed"
                        ? "Registered"
                        : event.userRegistrationStatus === "cancelled"
                          ? "Cancelled"
                          : "Pending"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString()} at{" "}
                      {event.eventTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.currentRegistrations}/{event.capacity} registered
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {event.activities.map((activity: any) => (
                    <Badge
                      key={activity.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {activity.name}
                      {activity.type ? ` (${activity.type})` : ""}
                    </Badge>
                  ))}
                </div>

                <div className="pt-2">
                  {!event.userRegistrationStatus ? (
                    <Dialog
                      open={openDialogId === Number(event.id)}
                      onOpenChange={(open) =>
                        setOpenDialogId(open ? Number(event.id) : null)
                      }
                    >
                      <DialogTrigger
                        render={
                          <Button className="w-full" disabled={event.isFull}>
                            {event.isFull ? "Event Full" : "Register Now"}
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Register for {event.name}</DialogTitle>
                          <DialogDescription>
                            Secure your spot at this amazing event.
                          </DialogDescription>
                        </DialogHeader>
                        <RegisterForm
                          eventId={Number(event.id)}
                          availableSpots={
                            event.capacity - event.currentRegistrations
                          }
                          capacity={event.capacity}
                          currentRegistrations={event.currentRegistrations}
                          occupancyPercentage={
                            (event.currentRegistrations / event.capacity) * 100
                          }
                          isFull={event.isFull}
                          onSuccess={() => setOpenDialogId(null)}
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `/user/registrations`)
                      }
                    >
                      Manage Registration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">
              {initialEvents.length === 0
                ? "No events available"
                : "No events match your filters"}
            </h3>
            <p className="mt-1 text-muted-foreground">
              {initialEvents.length === 0
                ? "Check back later for new community events."
                : "Try adjusting your search term or filters to find what you're looking for."}
            </p>
            {(searchTerm ||
              (selectedVenue && selectedVenue !== "_all") ||
              (selectedActivityType && selectedActivityType !== "_all") ||
              selectedDate) && (
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedVenue("")
                  setSelectedActivityType("")
                  setSelectedDate("")
                }}
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
