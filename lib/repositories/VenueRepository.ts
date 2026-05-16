/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { venues } from "@/db/schema"
import { BaseRepository } from "./BaseRepository"
import { Venue } from "../models/Venue"
import { NotFoundException } from "../exceptions/BaseException"

/**
 * Venue Repository
 * Demonstrates Design Pattern: Repository Pattern
 */
export class VenueRepository extends BaseRepository<Venue> {
  async create(data: Partial<Venue>): Promise<Venue> {
    try {
      const [newVenue] = await db
        .insert(venues)
        .values({
          name: data.name!,
          address: data.address!,
          capacity: data.capacity!,
          description: data.description,
        })
        .returning()

      return this.mapToModel(newVenue)
    } catch (error) {
      this.handleDatabaseError(error, "create venue")
    }
  }

  async update(id: number, data: Partial<Venue>): Promise<Venue> {
    try {
      await this.ensureExists(id, "Venue")

      const [updatedVenue] = await db
        .update(venues)
        .set({
          name: data.name,
          address: data.address,
          capacity: data.capacity,
          description: data.description,
          updatedAt: new Date(),
        })
        .where(eq(venues.id, id))
        .returning()

      return this.mapToModel(updatedVenue)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "update venue")
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.ensureExists(id, "Venue")
      await db.delete(venues).where(eq(venues.id, id))
      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "delete venue")
    }
  }

  async findById(id: number): Promise<Venue | null> {
    try {
      const venue = await db.query.venues.findFirst({
        where: eq(venues.id, id),
      })

      return venue ? this.mapToModel(venue) : null
    } catch (error) {
      this.handleDatabaseError(error, "find venue by ID")
    }
  }

  async findAll(): Promise<Venue[]> {
    try {
      const allVenues = await db.query.venues.findMany()
      return allVenues.map((venue) => this.mapToModel(venue))
    } catch (error) {
      this.handleDatabaseError(error, "find all venues")
    }
  }

  private mapToModel(data: any): Venue {
    return new Venue({
      id: data.id,
      name: data.name,
      address: data.address,
      capacity: data.capacity,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
