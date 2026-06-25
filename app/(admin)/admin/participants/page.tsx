/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ParticipantsTable } from "@/components/admin/participants/ParticipantsTable"
import { db } from "@/db"
import { registrations } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export default async function AdminParticipantsPage() {
  // Check authentication
  const cookieStore = await cookies()
  const adminRole = cookieStore.get("adminRole")?.value

  if (adminRole !== "ADMIN") {
    redirect("/auth/admin-login")
  }

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
      registrationDate: r.registrationDate,
      userName: r.participant?.user?.name || "Anonymous",
      userEmail: r.participant?.user?.email || "No email",
      eventName: r.event?.name || "TBA",
      status: r.status || "confirmed",
      quantity: r.quantity || 1,
      ticketId: r.ticketId || null,
      qrCode: r.qrCode || null,
    }))
  } catch (err) {
    console.error("Error loading admin participants page:", err)
    allRegistrations = []
  }

  return <ParticipantsTable registrations={allRegistrations} />
}
