// ─── Abstract Notification Base Class ────────────────────────────────────────
// Demonstrates: Abstract classes, Polymorphism, Abstraction

export interface NotificationPayload {
  recipientName: string
  recipientEmail: string
  recipientPhone?: string | null
  subject: string
  message: string
}

export abstract class Notification {
  protected payload: NotificationPayload

  constructor(payload: NotificationPayload) {
    this.payload = payload
  }

  // Abstract method — every subclass MUST implement this
  abstract send(): Promise<void>

  // Shared concrete method available to all subclasses
  protected formatMessage(): string {
    return `Dear ${this.payload.recipientName},\n\n${this.payload.message}`
  }

  getRecipient(): string {
    return this.payload.recipientEmail
  }
}

// ─── EmailNotification ────────────────────────────────────────────────────────
// Demonstrates: Polymorphism — same send() method, different behaviour

export class EmailNotification extends Notification {
  constructor(payload: NotificationPayload) {
    super(payload)
  }

  async send(): Promise<void> {
    // In production this would call an email provider (Resend, SendGrid, etc.)
    // For demonstration it logs the intent — the interface contract is fulfilled.
    console.log(
      `[EmailNotification] Sending email to: ${this.payload.recipientEmail}`
    )
    console.log(`[EmailNotification] Subject: ${this.payload.subject}`)
    console.log(`[EmailNotification] Body:\n${this.formatMessage()}`)
  }
}

// ─── SmsNotification ──────────────────────────────────────────────────────────
// Demonstrates: Polymorphism — same send() method, different behaviour

export class SmsNotification extends Notification {
  constructor(payload: NotificationPayload) {
    super(payload)
  }

  async send(): Promise<void> {
    // In production this would call Twilio, AWS SNS, etc.
    if (!this.payload.recipientPhone) {
      console.warn(
        `[SmsNotification] No phone number for ${this.payload.recipientName}, skipping.`
      )
      return
    }
    console.log(
      `[SmsNotification] Sending SMS to: ${this.payload.recipientPhone}`
    )
    console.log(`[SmsNotification] Message: ${this.payload.message}`)
  }
}

// ─── NotificationFactory ──────────────────────────────────────────────────────
// Demonstrates: Factory Pattern — produces the correct Notification subclass
// without the caller needing to know which concrete class to instantiate.

export type NotificationChannel = "EMAIL" | "SMS"

export class NotificationFactory {
  static create(
    channel: NotificationChannel,
    payload: NotificationPayload
  ): Notification {
    switch (channel) {
      case "EMAIL":
        return new EmailNotification(payload)
      case "SMS":
        return new SmsNotification(payload)
      default:
        throw new Error(`Unsupported notification channel: ${channel}`)
    }
  }

  // Send via all channels at once — demonstrates polymorphism in action
  static async sendAll(payload: NotificationPayload): Promise<void> {
    const channels: NotificationChannel[] = ["EMAIL", "SMS"]
    const notifications: Notification[] = channels.map((ch) =>
      NotificationFactory.create(ch, payload)
    )
    // Same .send() call — different behaviour per subclass
    await Promise.all(notifications.map((n) => n.send()))
  }
}
