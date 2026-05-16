"use client"

import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
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
  const formattedDate = format(new Date(eventDate), "EEE d MMM · h:mm a")

  return (
    <Link href={`/events/${id}`} className="block h-full">
      <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md hover:ring-primary/30">
        <CardHeader>
          {activityType && (
            <Badge variant="secondary" className="w-fit">
              {activityType}
            </Badge>
          )}
          <CardTitle className="line-clamp-2 text-sm leading-snug font-medium group-hover:text-primary">
            {name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{venue.name}</span>
          </div>

          <CardDescription className="mt-1 line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>

        <CardFooter className="mt-auto">
          <span className="text-xs font-medium text-primary transition-colors group-hover:text-primary/80">
            Register →
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
