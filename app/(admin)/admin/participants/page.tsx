import { ParticipantsTable } from "@/components/admin/participants/ParticipantsTable"
import { db } from "@/db"
import { registrations } from "@/db/schema"
import { desc } from "drizzle-orm"

export default async function AdminParticipantsPage() {
  let allRegistrations: any[] = []

  try {
    const regs = await db.query.registrations.findMany({
      orderBy: [desc(registrations.registrationDate)],
      with: {
        event: true,
        participant: {
          with: {
            user: true,
          },
        },
      },
    })

    allRegistrations = regs.map((r) => ({
      id: r.id,
      status: r.status,
      registrationDate: r.registrationDate,
      userName: r.participant?.user?.name || "Anonymous",
      userEmail: r.participant?.user?.email || "No email",
      userPhone: r.participant?.user?.phone || null,
      eventName: r.event?.name || "TBA",
    }))
  } catch (err) {
    console.error("Error loading admin participants page:", err)
    allRegistrations = []
  }

  return <ParticipantsTable registrations={allRegistrations} />
}
