import type {
  CreateEventDto,
  UpdateEventDto,
  EventDto,
} from "@/src/domain/dto/EventDto"

// ─── IEventRepository ─────────────────────────────────────────────────────────
// Defines the contract for all event data-access operations.
// Concrete implementations must satisfy every method declared here.

export interface IEventRepository {
  getAll(): Promise<EventDto[]>
  getById(id: number): Promise<EventDto | null>
  create(data: CreateEventDto): Promise<EventDto>
  update(id: number, data: UpdateEventDto): Promise<EventDto>
  delete(id: number): Promise<void>
  linkVenue(eventId: number, venueId: number): Promise<void>
  unlinkVenue(eventId: number): Promise<void>
  linkActivities(eventId: number, activityIds: number[]): Promise<void>
  unlinkActivities(eventId: number): Promise<void>
}
