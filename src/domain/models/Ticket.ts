// ─── TicketFactory ────────────────────────────────────────────────────────────
// Demonstrates: Factory Pattern
// Centralises ticket ID generation so no caller ever constructs a ticket
// identifier directly — all go through the factory.

export class TicketFactory {
  /**
   * Generate a unique ticket ID.
   * Format: TKT-{base36 timestamp}-{random 6 chars}
   */
  static generateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TKT-${timestamp}-${random}`
  }
}
