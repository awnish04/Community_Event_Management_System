import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserDashboardStats } from "@/app/actions/user-dashboard"
import { DashboardCards } from "@/components/user/dashboard/DashboardCards"

export const dynamic = "force-dynamic"

export default async function UserDashboardPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("userRole")?.value
  const userName = cookieStore.get("userName")?.value
  const userEmail = cookieStore.get("userEmail")?.value

  // Redirect if not authenticated
  if (userRole !== "USER" || !userEmail) {
    redirect("/auth/login")
  }

  const stats = await getUserDashboardStats(userEmail)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userName || "User"}!</h1>
        <p className="text-muted-foreground">
          Here is an overview of your community event activity.
        </p>
      </div>

      <DashboardCards
        totalRegistrations={stats?.totalRegistrations || 0}
        confirmedRegistrations={stats?.confirmedRegistrations || 0}
        upcomingEvents={stats?.upcomingEvents || 0}
        totalEvents={stats?.totalEvents || 0}
      />
    </div>
  )
}
