import { VenuesTable } from "@/components/admin/venues/VenuesTable"
import { db } from "@/db"
import { venues } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminVenuesPage() {
  let allVenues: (typeof venues.$inferSelect)[] = []

  try {
    allVenues = await db.select().from(venues).orderBy(desc(venues.createdAt))
  } catch {
    allVenues = []
  }

  return <VenuesTable venues={allVenues} />
}
