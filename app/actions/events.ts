"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { venues, events } from "@/db/schema"
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
  const imageUrl = (formData.get("imageUrl") as string) || null
  const venueIdRaw = formData.get("venueId") as string
  const venueId = venueIdRaw ? parseInt(venueIdRaw, 10) : null

  const activityIdsRaw = formData.getAll("activityIds") as string[]
  const activityIds = activityIdsRaw
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id))

  if (!name || !description || !eventDate || !eventTime) {
    throw new Error("All required fields must be filled.")
  }

  // Derive capacity from venue if one is selected
  let capacity = 0
  if (venueId) {
    const venue = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1)
    if (venue.length === 0) throw new Error("Selected venue not found.")
    capacity = venue[0].capacity
  } else {
    // Fallback: try manual capacity from form (in case of no venue)
    const manualCap = parseInt(formData.get("capacity") as string, 10)
    if (!manualCap || manualCap <= 0) throw new Error("Please select a venue to set the event capacity.")
    capacity = manualCap
  }

  // Delegate to EventService — demonstrates Service Layer + Repository Pattern
  await eventService.createEvent({
    name,
    description,
    eventDate: new Date(eventDate),
    eventTime,
    capacity,
    imageUrl,
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
  const imageUrl = (formData.get("imageUrl") as string) || null
  const venueIdRaw = formData.get("venueId") as string
  const venueId =
    venueIdRaw && venueIdRaw !== "_none" ? parseInt(venueIdRaw, 10) : null

  const activityIdsRaw = formData.getAll("activityIds") as string[]
  const activityIds = activityIdsRaw
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id))

  if (!name || !description || !eventDate || !eventTime) {
    throw new Error("All required fields must be filled.")
  }

  // Derive capacity from venue if one is selected
  let capacity = 0
  if (venueId) {
    const venue = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1)
    if (venue.length === 0) throw new Error("Selected venue not found.")
    capacity = venue[0].capacity
  } else {
    // Fallback: try manual capacity from form
    const manualCap = parseInt(formData.get("capacity") as string, 10)
    if (!manualCap || manualCap <= 0) throw new Error("Please select a venue to set the event capacity.")
    capacity = manualCap
  }

  // Delegate core update + relation sync to EventService
  await eventService.updateEvent(id, {
    name,
    description,
    eventDate: new Date(eventDate),
    eventTime,
    capacity,
    imageUrl,
    venueId,
    activityIds,
  })

  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath("/admin/events")
}

/**
 * Cancel an event (sets status = "cancelled").
 * This is an admin-only action.
 */
export async function cancelEvent(id: number): Promise<void> {
  await db
    .update(events)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(events.id, id))

  revalidatePath("/")
  revalidatePath("/user/events")
  revalidatePath("/user/registrations")
  revalidatePath("/admin/events")
}
