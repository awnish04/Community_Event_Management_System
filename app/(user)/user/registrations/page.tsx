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
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { getUserRegistrations } from "@/app/actions/user-dashboard"

export default function UserRegistrationsPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      getUserRegistrations(user.email).then((data) => {
        setRegistrations(data)
        setLoading(false)
      })
    }
  }, [user])

  const handleCancelRegistration = (registrationId: string) => {
    // In a full implementation, this would call a server action to cancel
    setRegistrations(registrations.filter((r) => r.id !== registrationId))
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Registrations</h1>
        <p className="text-muted-foreground">Manage your event registrations</p>
      </div>

      {registrations.length > 0 ? (
        <div className="grid gap-4">
          {registrations.map((registration) => (
            <Card key={registration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{registration.eventName}</CardTitle>
                    <CardDescription>
                      Registered on{" "}
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      registration.status === "CONFIRMED" ? "default" : "secondary"
                    }
                  >
                    {registration.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(registration.event.eventDate).toLocaleDateString()}{" "}
                      at {registration.event.eventTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{registration.event.venue.name}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleCancelRegistration(registration.id)}
                >
                  Cancel Registration
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t registered for any events yet
            </p>
            <Button className="mt-4" onClick={() => window.location.href = "/user/events"}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
