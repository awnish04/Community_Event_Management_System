import { ActivitiesTable } from "@/components/admin/activities/ActivitiesTable"
import { db } from "@/db"
import { activities } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminActivitiesPage() {
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
