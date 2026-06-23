import { db } from "@/db"
import { registrations } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import type { IRegistrationRepository } from "./interfaces/IRegistrationRepository"
import type {
  CreateRegistrationDto,
  UpdateRegistrationDto,
  RegistrationDto,
} from "@/src/domain/dto/RegistrationDto"

// ─── RegistrationRepository ───────────────────────────────────────────────────
// Concrete implementation of IRegistrationRepository.
// All database access for registrations is isolated here.

export class RegistrationRepository implements IRegistrationRepository {
  async getAll(): Promise<RegistrationDto[]> {
    return db.select().from(registrations)
  }

  async getById(id: number): Promise<RegistrationDto | null> {
    const result = await db.query.registrations.findFirst({
      where: eq(registrations.id, id),
    })
    return result ?? null
  }

  async getByParticipantId(participantId: number): Promise<RegistrationDto[]> {
    return db
      .select()
      .from(registrations)
      .where(eq(registrations.participantId, participantId))
  }

  async getByEventId(eventId: number): Promise<RegistrationDto[]> {
    return db
      .select()
      .from(registrations)
      .where(eq(registrations.eventId, eventId))
  }

  async findDuplicate(
    participantId: number,
    eventId: number
  ): Promise<RegistrationDto | null> {
    const result = await db.query.registrations.findFirst({
      where: and(
        eq(registrations.participantId, participantId),
        eq(registrations.eventId, eventId)
      ),
    })
    return result ?? null
  }

  async create(data: CreateRegistrationDto): Promise<RegistrationDto> {
    const [created] = await db
      .insert(registrations)
      .values({
        participantId: data.participantId,
        eventId: data.eventId,
        status: data.status ?? "confirmed",
        ticketId: data.ticketId,
        qrCode: data.qrCode,
      })
      .returning()
    return created
  }

  async update(
    id: number,
    data: UpdateRegistrationDto
  ): Promise<RegistrationDto> {
    const [updated] = await db
      .update(registrations)
      .set({
        ...(data.ticketId !== undefined && { ticketId: data.ticketId }),
        ...(data.qrCode !== undefined && { qrCode: data.qrCode }),
        ...(data.status !== undefined && { status: data.status }),
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, id))
      .returning()
    return updated
  }

  async delete(id: number): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id))
  }

  async countConfirmedForEvent(eventId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.status, "confirmed")
        )
      )
    return Number(result[0]?.count ?? 0)
  }
}
