// ─── Data Transfer Objects for Event ─────────────────────────────────────────

export interface CreateEventDto {
  name: string
  description: string
  eventDate: Date
  eventTime: string
  capacity: number
  imageUrl?: string | null
  venueId?: number | null
  activityIds?: number[]
}

export interface UpdateEventDto {
  name?: string
  description?: string
  eventDate?: Date
  eventTime?: string
  capacity?: number
  imageUrl?: string | null
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
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}
