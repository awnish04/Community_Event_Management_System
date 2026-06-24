// ─── Data Transfer Objects for Registration ──────────────────────────────────

export interface CreateRegistrationDto {
  participantId: number
  eventId: number
  ticketId: string
  qrCode: string
  status?: string
  quantity?: number
}

export interface UpdateRegistrationDto {
  ticketId?: string
  qrCode?: string
  status?: string
}

export interface RegistrationDto {
  id: number
  participantId: number
  eventId: number
  status: string
  ticketId?: string | null
  qrCode?: string | null
  registrationDate: Date
}
