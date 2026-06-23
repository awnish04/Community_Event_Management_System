import { db } from "@/db"
import { events, eventVenues, eventActivities } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { IEventRepository } from "./interfaces/IEventRepository"
import type {
  CreateEventDto,
  UpdateEventDto,
  EventDto,
} from "@/src/domain/dto/EventDto"

// ─── EventRepository ──────────────────────────────────────────────────────────
// Concrete implementation of IEventRepository.
// All database access for events is isolated here — no other layer touches the DB directly.

export class EventRepository implements IEventRepository {
  async getAll(): Promise<EventDto[]> {
    return db.select().from(events)
  }

  async getById(id: number): Promise<EventDto | null> {
    const result = await db.query.events.findFirst({
      where: eq(events.id, id),
    })
    return result ?? null
  }

  async create(data: CreateEventDto): Promise<EventDto> {
    const [created] = await db
      .insert(events)
      .values({
        name: data.name,
        description: data.description,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        capacity: data.capacity,
      })
      .returning()
    return created
  }

  async update(id: number, data: UpdateEventDto): Promise<EventDto> {
    const [updated] = await db
      .update(events)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
        ...(data.eventTime !== undefined && { eventTime: data.eventTime }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning()
    return updated
  }

  async delete(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id))
  }

  async linkVenue(eventId: number, venueId: number): Promise<void> {
    const existing = await db.query.eventVenues.findFirst({
      where: eq(eventVenues.eventId, eventId),
    })
    if (existing) {
      await db
        .update(eventVenues)
        .set({ venueId })
        .where(eq(eventVenues.eventId, eventId))
    } else {
      await db.insert(eventVenues).values({ eventId, venueId })
    }
  }

  async unlinkVenue(eventId: number): Promise<void> {
    await db.delete(eventVenues).where(eq(eventVenues.eventId, eventId))
  }

  async linkActivities(eventId: number, activityIds: number[]): Promise<void> {
    if (activityIds.length === 0) return
    await db
      .insert(eventActivities)
      .values(activityIds.map((activityId) => ({ eventId, activityId })))
  }

  async unlinkActivities(eventId: number): Promise<void> {
    await db.delete(eventActivities).where(eq(eventActivities.eventId, eventId))
  }
}
