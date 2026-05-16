import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { registrations, participants } from "@/db/schema"
import { BaseRepository } from "./BaseRepository"
import { Registration, RegistrationStatus } from "../models/Registration"
import { IRegisterable } from "../interfaces/IEntity"
import {
  NotFoundException,
  AlreadyRegisteredException,
} from "../exceptions/BaseException"

/**
 * Registration Repository
 * Demonstrates Design Pattern: Repository Pattern
 * Implements IRegisterable interface
 */
export class RegistrationRepository
  extends BaseRepository<Registration>
  implements IRegisterable
{
  async create(data: Partial<Registration>): Promise<Registration> {
    try {
      // Check if already registered
      const existing = await this.isRegistered(
        data.participantId!,
        data.eventId!
      )
      if (existing) {
        throw new AlreadyRegisteredException()
      }

      const [newRegistration] = await db
        .insert(registrations)
        .values({
          participantId: data.participantId!,
          eventId: data.eventId!,
          status: data.status || "pending",
          registrationDate: data.registrationDate || new Date(),
        })
        .returning()

      return this.mapToModel(newRegistration)
    } catch (error) {
      if (error instanceof AlreadyRegisteredException) throw error
      this.handleDatabaseError(error, "create registration")
    }
  }

  async update(id: number, data: Partial<Registration>): Promise<Registration> {
    try {
      await this.ensureExists(id, "Registration")

      const [updatedRegistration] = await db
        .update(registrations)
        .set({
          status: data.status,
          updatedAt: new Date(),
        })
        .where(eq(registrations.id, id))
        .returning()

      return this.mapToModel(updatedRegistration)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "update registration")
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.ensureExists(id, "Registration")
      await db.delete(registrations).where(eq(registrations.id, id))
      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "delete registration")
    }
  }

  async findById(id: number): Promise<Registration | null> {
    try {
      const registration = await db.query.registrations.findFirst({
        where: eq(registrations.id, id),
      })

      return registration ? this.mapToModel(registration) : null
    } catch (error) {
      this.handleDatabaseError(error, "find registration by ID")
    }
  }

  async findAll(): Promise<Registration[]> {
    try {
      const allRegistrations = await db.query.registrations.findMany()
      return allRegistrations.map((reg) => this.mapToModel(reg))
    } catch (error) {
      this.handleDatabaseError(error, "find all registrations")
    }
  }

  /**
   * Register a participant for an event
   * Implements IRegisterable interface
   */
  async register(participantId: number, eventId: number): Promise<boolean> {
    try {
      await this.create({
        participantId,
        eventId,
        status: RegistrationStatus.PENDING,
      })
      return true
    } catch (error) {
      if (error instanceof AlreadyRegisteredException) throw error
      this.handleDatabaseError(error, "register for event")
    }
  }

  /**
   * Unregister a participant from an event
   * Implements IRegisterable interface
   */
  async unregister(participantId: number, eventId: number): Promise<boolean> {
    try {
      const registration = await this.findByParticipantAndEvent(
        participantId,
        eventId
      )

      if (!registration) {
        throw new NotFoundException("Registration")
      }

      await db
        .update(registrations)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(registrations.id, registration.id!))

      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "unregister from event")
    }
  }

  /**
   * Check if participant is registered for an event
   * Implements IRegisterable interface
   */
  async isRegistered(participantId: number, eventId: number): Promise<boolean> {
    try {
      const registration = await db.query.registrations.findFirst({
        where: and(
          eq(registrations.participantId, participantId),
          eq(registrations.eventId, eventId)
        ),
      })

      return !!registration && registration.status !== "cancelled"
    } catch (error) {
      this.handleDatabaseError(error, "check registration status")
    }
  }

  /**
   * Find registrations by participant ID
   */
  async findByParticipant(participantId: number): Promise<Registration[]> {
    try {
      const participantRegistrations = await db.query.registrations.findMany({
        where: eq(registrations.participantId, participantId),
      })

      return participantRegistrations.map((reg) => this.mapToModel(reg))
    } catch (error) {
      this.handleDatabaseError(error, "find registrations by participant")
    }
  }

  /**
   * Find registrations by event ID
   */
  async findByEvent(eventId: number): Promise<Registration[]> {
    try {
      const eventRegistrations = await db.query.registrations.findMany({
        where: eq(registrations.eventId, eventId),
      })

      return eventRegistrations.map((reg) => this.mapToModel(reg))
    } catch (error) {
      this.handleDatabaseError(error, "find registrations by event")
    }
  }

  /**
   * Find registration by participant and event
   */
  private async findByParticipantAndEvent(
    participantId: number,
    eventId: number
  ): Promise<Registration | null> {
    try {
      const registration = await db.query.registrations.findFirst({
        where: and(
          eq(registrations.participantId, participantId),
          eq(registrations.eventId, eventId)
        ),
      })

      return registration ? this.mapToModel(registration) : null
    } catch (error) {
      this.handleDatabaseError(
        error,
        "find registration by participant and event"
      )
    }
  }

  private mapToModel(data: any): Registration {
    return new Registration({
      id: data.id,
      participantId: data.participantId,
      eventId: data.eventId,
      status: data.status as RegistrationStatus,
      registrationDate: new Date(data.registrationDate),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
