import {
  Calendar,
  Users,
  MapPin,
  ClipboardList,
  Clock,
  TrendingUp,
} from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  totalEvents: number
  upcomingEvents: number
  totalParticipants: number
  newParticipants: number
  totalVenues: number
  totalActivities: number
  totalRegistrations: number
  pendingRegistrations: number
}

export function SectionCards({
  totalEvents,
  upcomingEvents,
  totalParticipants,
  newParticipants,
  totalVenues,
  totalActivities,
  totalRegistrations,
  pendingRegistrations,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Events */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="size-4" /> Events
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEvents}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {upcomingEvents} upcoming
          </div>
          <div className="text-muted-foreground">Total community events</div>
        </CardFooter>
      </Card>

      {/* Participants */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Users className="size-4" /> Participants
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalParticipants.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +{newParticipants} this month
          </div>
          <div className="text-muted-foreground">Registered users</div>
        </CardFooter>
      </Card>

      {/* Registrations */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Clock className="size-4" /> Pending Registrations
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingRegistrations}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalRegistrations - pendingRegistrations} confirmed
          </div>
          <div className="text-muted-foreground">
            Registrations awaiting review
          </div>
        </CardFooter>
      </Card>

      {/* Venues & Activities */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="size-4" /> Venues
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalVenues}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalActivities} activity types
          </div>
          <div className="text-muted-foreground">Active event locations</div>
        </CardFooter>
      </Card>
    </div>
  )
}
