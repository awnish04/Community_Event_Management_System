import type {
  CreateRegistrationDto,
  UpdateRegistrationDto,
  RegistrationDto,
} from "@/src/domain/dto/RegistrationDto"

// ─── IRegistrationRepository ──────────────────────────────────────────────────
// Defines the contract for all registration data-access operations.

export interface IRegistrationRepository {
  getAll(): Promise<RegistrationDto[]>
  getById(id: number): Promise<RegistrationDto | null>
  getByParticipantId(participantId: number): Promise<RegistrationDto[]>
  getByEventId(eventId: number): Promise<RegistrationDto[]>
  findDuplicate(
    participantId: number,
    eventId: number
  ): Promise<RegistrationDto | null>
  create(data: CreateRegistrationDto): Promise<RegistrationDto>
  update(id: number, data: UpdateRegistrationDto): Promise<RegistrationDto>
  delete(id: number): Promise<void>
  countConfirmedForEvent(eventId: number): Promise<number>
}
