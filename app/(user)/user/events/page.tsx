import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getDiscoverEvents } from "@/app/actions/user-dashboard"
import { UserEventsView } from "@/components/user/events/UserEventsView"

export const dynamic = "force-dynamic"

export default async function UserEventsPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("userRole")?.value
  const email = cookieStore.get("userEmail")?.value

  // Redirect if not authenticated
  if (userRole !== "USER" || !email) {
    redirect("/auth/login")
  }

  const events = await getDiscoverEvents(email)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and register for upcoming community events.
        </p>
      </div>

      <UserEventsView initialEvents={events} />
    </div>
  )
}
