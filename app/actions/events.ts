"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { events, eventVenues, venues, eventActivities } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const eventDate = formData.get("eventDate") as string
  const eventTime = formData.get("eventTime") as string
  const capacity = parseInt(formData.get("capacity") as string, 10)
  const venueIdRaw = formData.get("venueId") as string
  const venueId = venueIdRaw ? parseInt(venueIdRaw, 10) : null

  const activityIdsRaw = formData.getAll("activityIds") as string[]
  const activityIds = activityIdsRaw
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id))

  if (!name || !description || !eventDate || !eventTime || !capacity) {
    throw new Error("All required fields must be filled.")
  }

  const [newEvent] = await db
    .insert(events)
    .values({
      name,
      description,
      eventDate: new Date(eventDate),
      eventTime,
      capacity,
    })
    .returning({ id: events.id })

  if (venueId) {
    await db.insert(eventVenues).values({
      eventId: newEvent.id,
      venueId,
    })
  }

  if (activityIds.length > 0) {
    await db.insert(eventActivities).values(
      activityIds.map((activityId) => ({
        eventId: newEvent.id,
        activityId,
      }))
    )
  }

  revalidatePath("/")
  revalidatePath("/events")
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

export async function editVenue(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const capacity = parseInt(formData.get("capacity") as string, 10)
  const description = (formData.get("description") as string) || null

  if (!name || !address || !capacity) {
    throw new Error("Name, address, and capacity are required.")
  }

  await db
    .update(venues)
    .set({ name, address, capacity, description, updatedAt: new Date() })
    .where(eq(venues.id, id))

  revalidatePath("/admin/venues")
}

export async function deleteEvent(id: number) {
  await db.delete(events).where(eq(events.id, id))
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}

export async function editEvent(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const eventDate = formData.get("eventDate") as string
  const eventTime = formData.get("eventTime") as string
  const capacity = parseInt(formData.get("capacity") as string, 10)
  const venueIdRaw = formData.get("venueId") as string
  const venueId =
    venueIdRaw && venueIdRaw !== "_none" ? parseInt(venueIdRaw, 10) : null

  const activityIdsRaw = formData.getAll("activityIds") as string[]
  const activityIds = activityIdsRaw
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id))

  if (!name || !description || !eventDate || !eventTime || !capacity) {
    throw new Error("All required fields must be filled.")
  }

  await db
    .update(events)
    .set({
      name,
      description,
      eventDate: new Date(eventDate),
      eventTime,
      capacity,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))

  if (venueId) {
    // Check if venue already exists
    const existing = await db.query.eventVenues.findFirst({
      where: eq(eventVenues.eventId, id),
    })

    if (existing) {
      if (existing.venueId !== venueId) {
        await db
          .update(eventVenues)
          .set({ venueId })
          .where(eq(eventVenues.eventId, id))
      }
    } else {
      await db.insert(eventVenues).values({
        eventId: id,
        venueId,
      })
    }
  } else {
    // delete any existing venue links
    await db.delete(eventVenues).where(eq(eventVenues.eventId, id))
  }

  // Update activities relation
  await db.delete(eventActivities).where(eq(eventActivities.eventId, id))
  if (activityIds.length > 0) {
    await db.insert(eventActivities).values(
      activityIds.map((activityId) => ({
        eventId: id,
        activityId,
      }))
    )
  }

  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}
