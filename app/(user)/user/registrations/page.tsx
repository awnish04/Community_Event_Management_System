"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Loader2, CalendarX, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { getUserRegistrations } from "@/app/actions/user-dashboard"
import { deleteRegistration } from "@/app/actions/registrations"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function UserRegistrationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [activeRegId, setActiveRegId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      getUserRegistrations(user.email).then((data) => {
        setRegistrations(data)
        setLoading(false)
      })
    }
  }, [user])

  const handleCancelRegistration = (registrationId: string) => {
    setActiveRegId(registrationId)
    startTransition(async () => {
      try {
        await deleteRegistration(parseInt(registrationId, 10))
        setRegistrations((prev) => prev.filter((r) => r.id !== registrationId))
        router.refresh()
      } catch (err) {
        console.error("Failed to cancel registration:", err)
      } finally {
        setActiveRegId(null)
      }
    })
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Registrations</h1>
        <p className="text-muted-foreground">Manage your event registrations</p>
      </div>

      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {registrations.map((registration) => {
            const isCancelling = isPending && activeRegId === registration.id
            const displayStatus = 
              registration.status === "CONFIRMED" 
                ? "Approved" 
                : registration.status === "CANCELLED" 
                ? "Rejected" 
                : "Pending"

            return (
              <Card
                key={registration.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border shadow-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">
                        {registration.eventName}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        Registered{" "}
                        {new Date(
                          registration.registrationDate
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 capitalize font-semibold px-2.5 py-0.5 rounded-full border shadow-none",
                        registration.status === "CONFIRMED"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50"
                          : registration.status === "CANCELLED"
                            ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/50"
                            : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50"
                      )}
                    >
                      {displayStatus}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-0">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {new Date(
                          registration.event.eventDate
                        ).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        &middot; {registration.event.eventTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">
                        {registration.event.venue.name}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
                    onClick={() => handleCancelRegistration(registration.id)}
                    disabled={isPending}
                  >
                    {isCancelling ? (
                      <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {isCancelling ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <CalendarX className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="text-base font-medium text-foreground">
            No registrations yet
          </p>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            You haven&apos;t signed up for any events. Find something worth
            showing up for.
          </p>
          <Link
            href="/user/events"
            className={buttonVariants({ variant: "default" })}
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  )
}
