"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { venues } from "@/db/schema"
import { eq } from "drizzle-orm"

// ── OOP layer imports ─────────────────────────────────────────────────────────
// createEvent and deleteEvent are delegated to EventService → EventRepository.
// editEvent keeps direct DB access (full update logic is complex to delegate
// without breaking the application — editEvent is left as-is intentionally).
import { eventService } from "@/src/container"
import { EventNotFoundException } from "@/src/domain/exceptions/AppExceptions"

/**
 * Create an event.
 *
 * Call chain:
 *   createEvent() [Server Action]
 *     → EventService.createEvent()  [Service — business rule: capacity > 0]
 *       → EventRepository.create()  [Repository → DB]
 *       → EventRepository.linkVenue()  [Repository → DB]
 *       → EventRepository.linkActivities()  [Repository → DB]
 */
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

  // Delegate to EventService — demonstrates Service Layer + Repository Pattern
  await eventService.createEvent({
    name,
    description,
    eventDate: new Date(eventDate),
    eventTime,
    capacity,
    venueId,
    activityIds,
  })

  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}

/**
 * Delete an event.
 *
 * Call chain:
 *   deleteEvent() [Server Action]
 *     → EventService.deleteEvent()  [Service — throws EventNotFoundException if missing]
 *       → EventRepository.delete()  [Repository → DB]
 */
export async function deleteEvent(id: number) {
  try {
    // Delegate to EventService — throws typed EventNotFoundException if not found
    await eventService.deleteEvent(id)
  } catch (err) {
    if (err instanceof EventNotFoundException) {
      // Event already deleted — treat as success
      return
    }
    throw err
  }

  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}

// ── Venue actions — direct DB (not delegated, venue service not in scope) ─────

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

// ── editEvent — direct DB (complex multi-step update, kept as-is) ─────────────

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

  // Delegate core update + relation sync to EventService
  await eventService.updateEvent(id, {
    name,
    description,
    eventDate: new Date(eventDate),
    eventTime,
    capacity,
    venueId,
    activityIds,
  })

  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}
