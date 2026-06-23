// ─── Data Transfer Objects for Event ─────────────────────────────────────────

export interface CreateEventDto {
  name: string
  description: string
  eventDate: Date
  eventTime: string
  capacity: number
  venueId?: number | null
  activityIds?: number[]
}

export interface UpdateEventDto {
  name?: string
  description?: string
  eventDate?: Date
  eventTime?: string
  capacity?: number
  venueId?: number | null
  activityIds?: number[]
}

export interface EventDto {
  id: number
  name: string
  description: string
  eventDate: Date
  eventTime: string
  capacity: number
  createdAt: Date
  updatedAt: Date
}
