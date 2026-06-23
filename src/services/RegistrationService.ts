import type { IRegistrationRepository } from "@/src/repositories/interfaces/IRegistrationRepository"
import type { IEventRepository } from "@/src/repositories/interfaces/IEventRepository"
import type { IUserRepository } from "@/src/repositories/interfaces/IUserRepository"
import type { RegistrationDto } from "@/src/domain/dto/RegistrationDto"
import { TicketFactory } from "@/src/domain/models/Ticket"
import { NotificationFactory } from "@/src/domain/notifications/Notification"
import {
  EventFullException,
  DuplicateRegistrationException,
  EventNotFoundException,
  UserNotFoundException,
  RegistrationNotFoundException,
} from "@/src/domain/exceptions/AppExceptions"
import { db } from "@/db"
import { participants } from "@/db/schema"
import { eq } from "drizzle-orm"
import QRCode from "qrcode"

// ─── RegistrationService ──────────────────────────────────────────────────────
// Business logic for event registration.
// Demonstrates:
//   ✅ Dependency Injection (3 repositories injected via constructor)
//   ✅ Custom Exceptions (EventFullException, DuplicateRegistrationException)
//   ✅ Factory Pattern (TicketFactory, NotificationFactory)
//   ✅ Polymorphism (NotificationFactory.sendAll dispatches to EmailNotification + SmsNotification)

export class RegistrationService {
  // Constructor Dependency Injection — receives interfaces, not concrete classes
  constructor(
    private readonly registrationRepo: IRegistrationRepository,
    private readonly eventRepo: IEventRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async getRegistrationById(id: number): Promise<RegistrationDto> {
    const reg = await this.registrationRepo.getById(id)
    if (!reg) throw new RegistrationNotFoundException(id)
    return reg
  }

  async getRegistrationsForParticipant(
    participantId: number
  ): Promise<RegistrationDto[]> {
    return this.registrationRepo.getByParticipantId(participantId)
  }

  async registerForEvent(
    userEmail: string,
    eventId: number
  ): Promise<{ registration: RegistrationDto; ticketId: string }> {
    // 1. Validate event exists
    const event = await this.eventRepo.getById(eventId)
    if (!event) throw new EventNotFoundException(eventId)

    // 2. Validate user exists
    const user = await this.userRepo.getByEmail(userEmail)
    if (!user) throw new UserNotFoundException(userEmail)

    // 3. Find or create participant row
    let participant = await db.query.participants.findFirst({
      where: eq(participants.userId, user.id),
    })
    if (!participant) {
      const [newP] = await db
        .insert(participants)
        .values({ userId: user.id })
        .returning()
      participant = newP
    }

    // 4. Check for duplicate registration — throws typed exception
    const duplicate = await this.registrationRepo.findDuplicate(
      participant.id,
      eventId
    )
    if (duplicate) throw new DuplicateRegistrationException(event.name)

    // 5. Check capacity — throws typed exception
    const confirmedCount =
      await this.registrationRepo.countConfirmedForEvent(eventId)
    if (confirmedCount >= event.capacity)
      throw new EventFullException(event.name)

    // 6. Generate ticket ID via TicketFactory (Factory Pattern)
    const ticketId = TicketFactory.generateId()

    // 7. Generate QR code
    const qrPayload = JSON.stringify({
      ticketId,
      eventId,
      participantName: user.name,
      issuedAt: new Date().toISOString(),
    })
    const qrCode = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
    })

    // 8. Persist the registration
    const registration = await this.registrationRepo.create({
      participantId: participant.id,
      eventId,
      status: "confirmed",
      ticketId,
      qrCode,
    })

    // 9. Send notification via NotificationFactory (Polymorphism)
    await NotificationFactory.create("EMAIL", {
      recipientName: user.name,
      recipientEmail: user.email,
      recipientPhone: user.phone,
      subject: `Your ticket for ${event.name}`,
      message: `You are registered for ${event.name}. Your ticket ID is: ${ticketId}`,
    }).send()

    return { registration, ticketId }
  }

  async cancelRegistration(id: number): Promise<void> {
    await this.getRegistrationById(id) // throws if not found
    await this.registrationRepo.delete(id)
  }

  async regenerateTicket(
    id: number
  ): Promise<{ ticketId: string; qrCode: string }> {
    const registration = await this.registrationRepo.getById(id)
    if (!registration) throw new RegistrationNotFoundException(id)

    // Get user name for ticket
    const participant = await db.query.participants.findFirst({
      where: eq(participants.id, registration.participantId),
      with: { user: true },
    })
    const participantName = participant?.user?.name ?? "Attendee"

    const ticket = TicketFactory.generateId()
    const qrPayload = JSON.stringify({
      ticketId: ticket,
      eventId: registration.eventId,
      participantName,
      issuedAt: new Date().toISOString(),
    })
    const qrCode = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 300,
      margin: 2,
    })

    await this.registrationRepo.update(id, {
      ticketId: ticket,
      qrCode,
      status: "confirmed",
    })

    return { ticketId: ticket, qrCode }
  }
}
