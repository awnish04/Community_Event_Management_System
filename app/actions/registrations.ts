"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { registrations, participants, users } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import QRCode from "qrcode"

export type RegisterResult =
  | { success: true; message: string; ticketId: string }
  | { success: false; error: string }

/**
 * Generate a unique ticket ID
 */
function generateTicketId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TKT-${timestamp}-${random}`
}

/**
 * Generate QR code data URL with actual QR code image
 */
async function generateQRCode(
  ticketId: string,
  eventId: number,
  userName: string
): Promise<string> {
  const data = JSON.stringify({
    ticketId,
    eventId,
    userName,
    timestamp: new Date().toISOString(),
  })

  try {
    // Generate actual QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
    })
    return qrDataUrl
  } catch (err) {
    console.error("QR code generation error:", err)
    // Fallback to base64 encoded data
    return `data:text/plain;base64,${Buffer.from(data).toString("base64")}`
  }
}

/**
 * Register a user for an event.
 * Automatically creates a confirmed registration with ticket ID and QR code.
 */
export async function registerForEvent(
  eventId: number,
  formData: FormData
): Promise<RegisterResult> {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const phone = (formData.get("phone") as string)?.trim() || null

  console.log("registerForEvent called:", { eventId, name, email, phone })

  if (!name || !email) {
    return { success: false, error: "Name and email are required." }
  }

  try {
    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    console.log("Found/creating user:", user)

    if (!user) {
      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email,
          phone,
          password: "placeholder",
        })
        .returning()
      user = newUser
      console.log("Created new user:", user)
    }

    // Find or create participant
    let participant = await db.query.participants.findFirst({
      where: eq(participants.userId, user.id),
    })

    console.log("Found/creating participant:", participant)

    if (!participant) {
      const [newParticipant] = await db
        .insert(participants)
        .values({ userId: user.id })
        .returning()
      participant = newParticipant
      console.log("Created new participant:", participant)
    }

    // Check for duplicate registration
    const existing = await db.query.registrations.findFirst({
      where: and(
        eq(registrations.participantId, participant.id),
        eq(registrations.eventId, eventId)
      ),
    })

    console.log("Checking for existing registration:", existing)

    if (existing) {
      return {
        success: false,
        error: "You are already registered for this event.",
      }
    }

    // Generate ticket ID and QR code
    const ticketId = generateTicketId()
    console.log("Step 1: Generated ticketId:", ticketId)

    const qrCode = await generateQRCode(ticketId, eventId, user.name)
    console.log("Step 2: Generated QR code (length):", qrCode.length)

    console.log("Step 3: About to insert registration with values:", {
      participantId: participant.id,
      eventId,
      status: "confirmed",
      ticketId,
      qrCodeLength: qrCode.length,
    })

    // Create registration with confirmed status and ticket
    let registration
    try {
      const result = await db
        .insert(registrations)
        .values({
          participantId: participant.id,
          eventId,
          status: "confirmed",
          ticketId,
          qrCode,
        })
        .returning()

      registration = result[0]
      console.log("Step 4: Insert successful, returned:", registration)
    } catch (insertError) {
      console.error("❌ INSERT FAILED:", insertError)
      throw insertError
    }

    // Verify the registration was saved by querying it back
    console.log("Step 5: Verifying registration was saved...")
    const verifyReg = await db.query.registrations.findFirst({
      where: eq(registrations.id, registration.id),
    })
    console.log("Step 6: Verification query result:", verifyReg)

    // Also check all registrations for this participant
    const allParticipantRegs = await db
      .select()
      .from(registrations)
      .where(eq(registrations.participantId, participant.id))
    console.log(
      `Step 7: All registrations for participantId ${participant.id} (count: ${allParticipantRegs.length}):`,
      allParticipantRegs
    )

    revalidatePath(`/events/${eventId}`)
    revalidatePath(`/user/events`)
    revalidatePath(`/user/registrations`)

    return {
      success: true,
      message: "You're registered! Your ticket has been generated.",
      ticketId,
    }
  } catch (err) {
    console.error("Registration error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function deleteRegistration(id: number) {
  await db.delete(registrations).where(eq(registrations.id, id))
  revalidatePath("/admin/participants")
  revalidatePath("/user/registrations")
}

/**
 * Generate ticket for existing registration (if missing)
 */
export async function generateTicketForRegistration(id: number) {
  const registration = await db.query.registrations.findFirst({
    where: eq(registrations.id, id),
    with: {
      participant: {
        with: {
          user: true,
        },
      },
    },
  })

  if (!registration) {
    throw new Error("Registration not found")
  }

  const ticketId = generateTicketId()
  const qrCode = await generateQRCode(
    ticketId,
    registration.eventId,
    registration.participant.user.name
  )

  await db
    .update(registrations)
    .set({
      ticketId,
      qrCode,
      status: "confirmed",
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, id))

  revalidatePath("/admin/participants")
  revalidatePath("/user/registrations")

  return { ticketId, qrCode }
}
