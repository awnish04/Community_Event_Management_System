"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { events, eventVenues, venues } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const eventDate = formData.get("eventDate") as string
  const eventTime = formData.get("eventTime") as string
  const capacity = parseInt(formData.get("capacity") as string, 10)
  const venueIdRaw = formData.get("venueId") as string
  const venueId = venueIdRaw ? parseInt(venueIdRaw, 10) : null

  if (!name || !description || !eventDate || !eventTime || !capacity) {
    throw new Error("All required fields must be filled.")
  }

  const [newEvent] = await db.insert(events).values({
    name,
    description,
    eventDate: new Date(eventDate),
    eventTime,
    capacity,
  }).returning({ id: events.id })

  if (venueId) {
    await db.insert(eventVenues).values({
      eventId: newEvent.id,
      venueId,
    })
  }

  revalidatePath("/admin/events")
}

export async function createVenue(formData: FormData) {
  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const capacity = parseInt(formData.get("capacity") as string, 10)
  const description = (formData.get("description") as string) || null

  if (!name || !address || !capacity) {
    throw new Error("Name, address, and capacity are required.")
  }

  await db.insert(venues).values({ name, address, capacity, description })

  revalidatePath("/admin/venues")
}

export async function deleteVenue(id: number) {
  await db.delete(venues).where(eq(venues.id, id))
  revalidatePath("/admin/venues")
}
