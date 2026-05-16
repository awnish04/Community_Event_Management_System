import { ParticipantsTable } from "@/components/admin/participants/ParticipantsTable"
import { db } from "@/db"
import { users } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminParticipantsPage() {
  let allUsers: (typeof users.$inferSelect)[] = []

  try {
    allUsers = await db.select().from(users).orderBy(desc(users.createdAt))
  } catch {
    allUsers = []
  }

  return <ParticipantsTable users={allUsers} />
}
