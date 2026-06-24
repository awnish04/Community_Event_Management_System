import { cookies } from "next/headers"
import { CalendarX } from "lucide-react"
import { getUserRegistrations } from "@/app/actions/user-dashboard"
import { RegistrationsTable } from "@/components/user/registrations/RegistrationsTable"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

interface Registration {
  id: string
  eventName: string
  eventStatus?: string
  status: string
  quantity?: number
  registrationDate: string
  ticketId?: string
  qrCode?: string
  event: {
    eventDate: string
    eventTime: string
    venue: {
      name: string
    }
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function UserRegistrationsPage() {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get("userEmail")?.value

  if (!userEmail) {
    redirect("/auth/login")
  }

  console.log("Server: Fetching registrations for:", userEmail)
  const registrations = (await getUserRegistrations(
    userEmail
  )) as Registration[]
  console.log("Server: Registrations loaded:", registrations)

  if (registrations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Registrations</h1>
          <p className="text-muted-foreground">
            View and manage your event registrations
          </p>
        </div>

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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Registrations</h1>
        <p className="text-muted-foreground">
          View and manage your event registrations and tickets
        </p>
      </div>

      <RegistrationsTable registrations={registrations} />
    </div>
  )
}
