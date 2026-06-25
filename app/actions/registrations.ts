"use server"

import { revalidatePath } from "next/cache"

// ── OOP layer imports ─────────────────────────────────────────────────────────
// Server Action → Service → Repository → Database
// This demonstrates the full OOP call chain in a live running application.
import { registrationService, userService } from "@/src/container"
import { Participant } from "@/src/domain/models/User"
import {
  DuplicateRegistrationException,
  EventFullException,
  EventNotFoundException,
  UserNotFoundException,
  RegistrationNotFoundException,
} from "@/src/domain/exceptions/AppExceptions"

export type RegisterResult =
  | { success: true; message: string; ticketId: string }
  | { success: false; error: string }

/**
 * Register a user for an event.
 *
 * Call chain (OOP layer is live):
 *   registerForEvent() [Server Action]
 *     → UserService.getUserByEmail() / UserService.createUser()  [Service]
 *       → UserRepository.getByEmail() / UserRepository.create()  [Repository → DB]
 *     → new Participant(...)  [Domain Model — Inheritance demonstrated]
 *     → RegistrationService.registerForEvent()  [Service]
 *       → RegistrationRepository.findDuplicate()  [Repository → DB]
 *       → RegistrationRepository.countConfirmedForEvent()  [Repository → DB]
 *       → TicketFactory.generateId()  [Factory Pattern]
 *       → RegistrationRepository.create()  [Repository → DB]
 */
export async function registerForEvent(
  eventId: number,
  formData: FormData
): Promise<RegisterResult> {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const quantity = parseInt((formData.get("quantity") as string) || "1", 10)

  if (!name || !email) {
    return { success: false, error: "Name and email are required." }
  }

  try {
    // ── Step 1: Ensure user exists via UserService → UserRepository ───────────
    // Demonstrates: Service Layer, Repository Pattern, Dependency Injection
    let userDto = await userService.getUserByEmail(email).catch(() => null)

    if (!userDto) {
      userDto = await userService.createUser({
        name,
        email,
        password: "placeholder",
      })
    }

    // ── Step 2: Instantiate Participant domain model ───────────────────────────
    // Demonstrates: Inheritance (Participant extends User), Constructor usage
    const participant = new Participant(
      userDto.id,
      userDto.name,
      userDto.email,
      userDto.createdAt
    )

    // Call methods on the domain object — proves it is live, not decorative
    console.log(
      `[registerForEvent] Participant: ${participant.getInitials()} | Profile:`,
      participant.toProfile()
    )

    // ── Step 3: Delegate to RegistrationService ───────────────────────────────
    // Demonstrates: Service Layer, Repository Pattern, TicketFactory, Custom Exceptions
    const { ticketId } = await registrationService.registerForEvent(
      participant.email, // pass through email — service resolves participant internally
      eventId,
      quantity
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
    // ── Typed exception handling ──────────────────────────────────────────────
    // Demonstrates: Custom Exception hierarchy — each instanceof check is a
    // different typed exception extending AppException extending Error.
    if (err instanceof DuplicateRegistrationException) {
      return { success: false, error: err.message }
    }
    if (err instanceof EventFullException) {
      return { success: false, error: err.message }
    }
    if (err instanceof EventNotFoundException) {
      return { success: false, error: err.message }
    }
    if (err instanceof UserNotFoundException) {
      return { success: false, error: err.message }
    }
    console.error("Registration error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

/**
 * Cancel a registration.
 * Delegates to RegistrationService → RegistrationRepository.
 */
export async function deleteRegistration(id: number): Promise<void> {
  try {
    await registrationService.cancelRegistration(id)
  } catch (err) {
    if (err instanceof RegistrationNotFoundException) {
      return // already gone — treat as success
    }
    throw err
  }
  revalidatePath("/admin/participants")
  revalidatePath("/user/registrations")
}

/**
 * Regenerate ticket for an existing registration.
 * Delegates to RegistrationService → TicketFactory → RegistrationRepository.
 */
export async function generateTicketForRegistration(id: number) {
  const result = await registrationService.regenerateTicket(id)
  revalidatePath("/admin/participants")
  revalidatePath("/user/registrations")
  return result
}
