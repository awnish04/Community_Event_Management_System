"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { registrations, participants, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export type RegisterResult =
  | { success: true; message: string }
  | { success: false; error: string }

/**
 * Register a user for an event.
 * In a real app this would check the session — for now it takes
 * email + name so users can self-register without a full auth system.
 */
export async function registerForEvent(
  eventId: number,
  formData: FormData
): Promise<RegisterResult> {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const phone = (formData.get("phone") as string)?.trim() || null

  if (!name || !email) {
    return { success: false, error: "Name and email are required." }
  }

  try {
    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email,
          phone,
          // placeholder password — in production this would be hashed
          password: "placeholder",
          role: "user",
        })
        .returning()
      user = newUser
    }

    // Find or create participant
    let participant = await db.query.participants.findFirst({
      where: eq(participants.userId, user.id),
    })

    if (!participant) {
      const [newParticipant] = await db
        .insert(participants)
        .values({ userId: user.id })
        .returning()
      participant = newParticipant
    }

    // Check for duplicate registration
    const existing = await db.query.registrations.findFirst({
      where: and(
        eq(registrations.participantId, participant.id),
        eq(registrations.eventId, eventId)
      ),
    })

    if (existing) {
      return {
        success: false,
        error: "You are already registered for this event.",
      }
    }

    // Create registration
    await db.insert(registrations).values({
      participantId: participant.id,
      eventId,
      status: "pending",
    })

    revalidatePath(`/events/${eventId}`)
    return { success: true, message: "You're registered! See you at the event." }
  } catch (err) {
    console.error("Registration error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
