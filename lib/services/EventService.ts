import { EventRepository } from "../repositories/EventRepository"
import { RegistrationRepository } from "../repositories/RegistrationRepository"
import { VenueRepository } from "../repositories/VenueRepository"
import { Event } from "../models/Event"
import { FilterCriteria } from "../interfaces/IEntity"
import {
  ValidationException,
  EventFullException,
  NotFoundException,
} from "../exceptions/BaseException"

/**
 * Event Service
 * Demonstrates Design Pattern: Service Layer Pattern
 * Purpose: Encapsulates business logic and coordinates between repositories
 */
export class EventService {
  private eventRepository: EventRepository
  private registrationRepository: RegistrationRepository
  private venueRepository: VenueRepository

  constructor() {
    this.eventRepository = new EventRepository()
    this.registrationRepository = new RegistrationRepository()
    this.venueRepository = new VenueRepository()
  }

  /**
   * Create a new event with validation
   * Demonstrates: Business logic layer, validation
   */
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    // Create event model for validation
    const event = new Event({
      name: eventData.name!,
      description: eventData.description!,
      eventDate: eventData.eventDate!,
      eventTime: eventData.eventTime!,
      venueId: eventData.venueId,
      capacity: eventData.capacity!,
      createdBy: eventData.createdBy,
    })

    // Validate event data
    const validationResult = await event.validate()
    if (!validationResult.isValid) {
      throw new ValidationException(
        "Event validation failed",
        validationResult.errors
      )
    }

    // Validate venue capacity if venue is specified
    if (eventData.venueId) {
      await this.validateVenueCapacity(eventData.venueId, eventData.capacity!)
    }

    // Create event in database
    return await this.eventRepository.create(eventData)
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    // Ensure event exists
    const existingEvent = await this.eventRepository.findById(id)
    if (!existingEvent) {
      throw new NotFoundException("Event", id)
    }

    // Validate venue capacity if being updated
    if (eventData.venueId && eventData.capacity) {
      await this.validateVenueCapacity(eventData.venueId, eventData.capacity)
    }

    return await this.eventRepository.update(id, eventData)
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: number): Promise<boolean> {
    return await this.eventRepository.delete(id)
  }

  /**
   * Get event by ID with full details
   */
  async getEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.findById(id)
    if (!event) {
      throw new NotFoundException("Event", id)
    }
    return event
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.findAll()
  }

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(): Promise<Event[]> {
    return await this.eventRepository.findUpcoming()
  }

  /**
   * Filter events by criteria
   * Demonstrates: Strategy pattern for filtering
   */
  async filterEvents(criteria: FilterCriteria): Promise<Event[]> {
    return await this.eventRepository.filter(criteria)
  }

  /**
   * Register participant for an event
   * Demonstrates: Business logic coordination between multiple repositories
   */
  async registerForEvent(
    participantId: number,
    eventId: number
  ): Promise<boolean> {
    // Get event details
    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new NotFoundException("Event", eventId)
    }

    // Check if event is full
    if (event.isFull()) {
      throw new EventFullException(event.name)
    }

    // Check if event is in the past
    if (event.isPast()) {
      throw new ValidationException("Cannot register for past events")
    }

    // Register participant
    return await this.registrationRepository.register(participantId, eventId)
  }

  /**
   * Get event statistics
   * Demonstrates: Business logic for analytics
   */
  async getEventStatistics(eventId: number) {
    const event = await this.getEventById(eventId)
    const registrations = await this.registrationRepository.findByEvent(eventId)

    const confirmedCount = registrations.filter(
      (r) => r.status === "confirmed"
    ).length
    const pendingCount = registrations.filter(
      (r) => r.status === "pending"
    ).length
    const cancelledCount = registrations.filter(
      (r) => r.status === "cancelled"
    ).length
    const waitlistCount = registrations.filter(
      (r) => r.status === "waitlist"
    ).length

    return {
      eventId: event.id,
      eventName: event.name,
      capacity: event.capacity,
      totalRegistrations: registrations.length,
      confirmedRegistrations: confirmedCount,
      pendingRegistrations: pendingCount,
      cancelledRegistrations: cancelledCount,
      waitlistRegistrations: waitlistCount,
      availableSpots: event.getAvailableSpots(),
      occupancyPercentage: event.getOccupancyPercentage(),
      isFull: event.isFull(),
    }
  }

  /**
   * Validate venue capacity
   * Private helper method
   */
  private async validateVenueCapacity(
    venueId: number,
    eventCapacity: number
  ): Promise<void> {
    const venue = await this.venueRepository.findById(venueId)
    if (!venue) {
      throw new NotFoundException("Venue", venueId)
    }

    if (!venue.canAccommodate(eventCapacity)) {
      throw new ValidationException(
        `Venue capacity (${venue.capacity}) is less than event capacity (${eventCapacity})`
      )
    }
  }
}
