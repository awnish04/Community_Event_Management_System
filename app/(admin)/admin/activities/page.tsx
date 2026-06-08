import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ActivitiesTable } from "@/components/admin/activities/ActivitiesTable"
import { db } from "@/db"
import { activities } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminActivitiesPage() {
  // Check authentication
  const cookieStore = await cookies()
  const adminRole = cookieStore.get("adminRole")?.value

  if (adminRole !== "ADMIN") {
    redirect("/auth/admin-login")
  }

  let allActivities: (typeof activities.$inferSelect)[] = []

  try {
    allActivities = await db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt))
  } catch {
    allActivities = []
  }

  return <ActivitiesTable activities={allActivities} />
}
