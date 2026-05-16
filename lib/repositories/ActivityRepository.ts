/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { activities } from "@/db/schema"
import { BaseRepository } from "./BaseRepository"
import { Activity, ActivityType } from "../models/Activity"
import { NotFoundException } from "../exceptions/BaseException"

/**
 * Activity Repository
 * Demonstrates Design Pattern: Repository Pattern
 */
export class ActivityRepository extends BaseRepository<Activity> {
  async create(data: Partial<Activity>): Promise<Activity> {
    try {
      const [newActivity] = await db
        .insert(activities)
        .values({
          name: data.name!,
          description: data.description,
          type: data.type!,
        })
        .returning()

      return this.mapToModel(newActivity)
    } catch (error) {
      this.handleDatabaseError(error, "create activity")
    }
  }

  async update(id: number, data: Partial<Activity>): Promise<Activity> {
    try {
      await this.ensureExists(id, "Activity")

      const [updatedActivity] = await db
        .update(activities)
        .set({
          name: data.name,
          description: data.description,
          type: data.type,
          updatedAt: new Date(),
        })
        .where(eq(activities.id, id))
        .returning()

      return this.mapToModel(updatedActivity)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "update activity")
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.ensureExists(id, "Activity")
      await db.delete(activities).where(eq(activities.id, id))
      return true
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      this.handleDatabaseError(error, "delete activity")
    }
  }

  async findById(id: number): Promise<Activity | null> {
    try {
      const activity = await db.query.activities.findFirst({
        where: eq(activities.id, id),
      })

      return activity ? this.mapToModel(activity) : null
    } catch (error) {
      this.handleDatabaseError(error, "find activity by ID")
    }
  }

  async findAll(): Promise<Activity[]> {
    try {
      const allActivities = await db.query.activities.findMany()
      return allActivities.map((activity) => this.mapToModel(activity))
    } catch (error) {
      this.handleDatabaseError(error, "find all activities")
    }
  }

  /**
   * Find activities by type
   */
  async findByType(type: ActivityType): Promise<Activity[]> {
    try {
      const activitiesByType = await db.query.activities.findMany({
        where: eq(activities.type, type),
      })

      return activitiesByType.map((activity) => this.mapToModel(activity))
    } catch (error) {
      this.handleDatabaseError(error, "find activities by type")
    }
  }

  private mapToModel(data: any): Activity {
    return new Activity({
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type as ActivityType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
