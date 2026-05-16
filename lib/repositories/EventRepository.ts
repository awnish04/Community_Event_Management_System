/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, gte, and, sql, desc, inArray } from "drizzle-orm"
import { db } from "@/db"
import { events, eventVenues, registrations } from "@/db/schema"
import { BaseRepository } from "./BaseRepository"
import { Event } from "../models/Event"
import { IFilterable, FilterCriteria } from "../interfaces/IEntity"
import { NotFoundException } from "../exceptions/BaseException"

/**
 * Event Repository
 * Demonstrates Design Pattern: Repository Pattern
 * Demonstrates OOP: Inheritance, Interface implementation
 */
export class EventRepository
  extends BaseRepository<Event>
  implements IFilterable<Event>
{
  /**
   * Create a new event
   */
  async create(data: Partial<Event>): Promise<Event> {
    try {
      const [newEvent] = await db
        .insert(events)
        .values({
          name: data.name!,
          description: data.description!,
          eventDate: data.eventDate!,
          eventTime: data.eventTime!,
          capacity: data.capacity!,
          createdBy: data.createdBy,
        })
        .returning()

      return this.mapToModel(newEvent)
    } catch (error) {
      this.handleDatabaseError(error, "create event")
    }
  }

  /**
   * Update an existing event
   */
  async update(id: number, data: Partial<Event>): Promise<Event> {
    try {
      await this.ensureExists(id, "Event")

      const [updatedEvent] = await db
        .update(events)
        .set({
          name: data.name,
          description: data.description,
          eventDate: data.eventDate,
          eventTime: data.eventTime,
          capacity: data.capacity,
          updatedAt: new Date(),
        })
        .where(eq(events.id, id))
        .returning()

      return this.mapToModel(updatedEvent)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "update event")
    }
  }

  /**
   * Delete an event
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.ensureExists(id, "Event")

      await db.delete(events).where(eq(events.id, id))
      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "delete event")
    }
  }

  /**
   * Find event by ID
   */
  async findById(id: number): Promise<Event | null> {
    try {
      const event = await db.query.events.findFirst({
        where: eq(events.id, id),
        with: {
          eventVenues: {
            with: {
              venue: true,
            },
          },
          eventActivities: {
            with: {
              activity: true,
            },
          },
        },
      })

      if (!event) return null

      // Get registration count
      const registrationCount = await this.getRegistrationCount(id)

      return this.mapToModel(event, registrationCount)
    } catch (error) {
      this.handleDatabaseError(error, "find event by ID")
    }
  }

  /**
   * Find all events
   */
  async findAll(): Promise<Event[]> {
    try {
      const allEvents = await db.query.events.findMany({
        with: {
          eventVenues: {
            with: {
              venue: true,
            },
          },
          eventActivities: {
            with: {
              activity: true,
            },
          },
        },
        orderBy: [desc(events.eventDate)],
      })

      // Get registration counts for all events
      const eventsWithCounts = await Promise.all(
        allEvents.map(async (event) => {
          const count = await this.getRegistrationCount(event.id)
          return this.mapToModel(event, count)
        })
      )

      return eventsWithCounts
    } catch (error) {
      this.handleDatabaseError(error, "find all events")
    }
  }

  /**
   * Find upcoming events
   */
  async findUpcoming(): Promise<Event[]> {
    try {
      const upcomingEvents = await db.query.events.findMany({
        where: gte(events.eventDate, new Date()),
        with: {
          eventVenues: {
            with: {
              venue: true,
            },
          },
          eventActivities: {
            with: {
              activity: true,
            },
          },
        },
        orderBy: [events.eventDate],
      })

      const eventsWithCounts = await Promise.all(
        upcomingEvents.map(async (event) => {
          const count = await this.getRegistrationCount(event.id)
          return this.mapToModel(event, count)
        })
      )

      return eventsWithCounts
    } catch (error) {
      this.handleDatabaseError(error, "find upcoming events")
    }
  }

  /**
   * Filter events by criteria
   * Implements IFilterable interface
   */
  async filter(criteria: FilterCriteria): Promise<Event[]> {
    try {
      const conditions = []

      if (criteria.venueId) {
        conditions.push(inArray(events.id,
          db.select({ eventId: eventVenues.eventId })
            .from(eventVenues)
            .where(eq(eventVenues.venueId, criteria.venueId))
        ))
      }

      if (criteria.fromDate) {
        conditions.push(gte(events.eventDate, new Date(criteria.fromDate)))
      }

      if (criteria.upcomingOnly) {
        conditions.push(gte(events.eventDate, new Date()))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const filteredEvents = await db.query.events.findMany({
        where: whereClause,
        with: {
          eventVenues: {
            with: {
              venue: true,
            },
          },
          eventActivities: {
            with: {
              activity: true,
            },
          },
        },
        orderBy: [events.eventDate],
      })

      const eventsWithCounts = await Promise.all(
        filteredEvents.map(async (event) => {
          const count = await this.getRegistrationCount(event.id)
          return this.mapToModel(event, count)
        })
      )

      return eventsWithCounts
    } catch (error) {
      this.handleDatabaseError(error, "filter events")
    }
  }

  /**
   * Get registration count for an event
   * Helper method
   */
  private async getRegistrationCount(eventId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          sql`${registrations.status} IN ('pending', 'confirmed')`
        )
      )

    return Number(result[0]?.count || 0)
  }

  /**
   * Map database record to Event model
   * Demonstrates: Data transformation
   */
  private mapToModel(data: any, registrationCount: number = 0): Event {
    return new Event({
      id: data.id,
      name: data.name,
      description: data.description,
      eventDate: new Date(data.eventDate),
      eventTime: data.eventTime,
      venueId: data.venueId,
      capacity: data.capacity,
      createdBy: data.createdBy,
      currentRegistrations: registrationCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
