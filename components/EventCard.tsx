"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { format } from "date-fns"

interface EventCardProps {
  id: number
  name: string
  description: string
  eventDate: string | Date
  eventTime: string
  venue: { name: string; address?: string }
  activityType?: string
}

export function EventCard({
  id,
  name,
  description,
  eventDate,
  eventTime,
  venue,
  activityType,
}: EventCardProps) {
  const formattedDate = format(new Date(eventDate), "EEE, d MMM · h:mm a")

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
          {activityType && (
            <Badge
              variant="secondary"
              className="shrink-0 px-2.5 py-0.5 text-sm"
            >
              {activityType}
            </Badge>
          )}
        </div>

        <h4 className=" group-hover:text-primary">
          {name}
        </h4>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate font-medium">{venue.name}</span>
        </div>

        <p>{description}</p>
      </CardContent>

      <CardFooter className="px-6">
        <Link href={`/events/${id}`} className="w-full">
          <Button className="w-full">Register</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
