import type { IEventRepository } from "@/src/repositories/interfaces/IEventRepository"
import type {
  CreateEventDto,
  UpdateEventDto,
  EventDto,
} from "@/src/domain/dto/EventDto"
import { EventNotFoundException } from "@/src/domain/exceptions/AppExceptions"

// ─── EventService ─────────────────────────────────────────────────────────────
// Business logic layer for events.
// Demonstrates: Dependency Injection (repository injected via constructor),
//               Encapsulation, Single Responsibility Principle

export class EventService {
  // Dependency Injection — accepts any class that satisfies IEventRepository
  constructor(private readonly repository: IEventRepository) {}

  async getAllEvents(): Promise<EventDto[]> {
    return this.repository.getAll()
  }

  async getEventById(id: number): Promise<EventDto> {
    const event = await this.repository.getById(id)
    if (!event) throw new EventNotFoundException(id)
    return event
  }

  async createEvent(data: CreateEventDto): Promise<EventDto> {
    // Business rule: capacity must be positive
    if (data.capacity <= 0) {
      throw new Error("Event capacity must be greater than zero.")
    }

    const event = await this.repository.create(data)

    if (data.venueId) {
      await this.repository.linkVenue(event.id, data.venueId)
    }

    if (data.activityIds && data.activityIds.length > 0) {
      await this.repository.linkActivities(event.id, data.activityIds)
    }

    return event
  }

  async updateEvent(id: number, data: UpdateEventDto): Promise<EventDto> {
    await this.getEventById(id) // throws EventNotFoundException if not found

    const updated = await this.repository.update(id, data)

    // Sync venue
    if (data.venueId !== undefined) {
      if (data.venueId) {
        await this.repository.linkVenue(id, data.venueId)
      } else {
        await this.repository.unlinkVenue(id)
      }
    }

    // Sync activities
    if (data.activityIds !== undefined) {
      await this.repository.unlinkActivities(id)
      if (data.activityIds.length > 0) {
        await this.repository.linkActivities(id, data.activityIds)
      }
    }

    return updated
  }

  async deleteEvent(id: number): Promise<void> {
    await this.getEventById(id) // throws if not found
    await this.repository.delete(id)
  }
}
