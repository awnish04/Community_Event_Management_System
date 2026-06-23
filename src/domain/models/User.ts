// ─── Base User Class ──────────────────────────────────────────────────────────
// Demonstrates: Classes, Constructors, Encapsulation

export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly createdAt: Date
  ) {}

  // Returns a display-safe representation (no password)
  toProfile(): {
    id: number
    name: string
    email: string
    phone: string | null
  } {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
    }
  }

  getInitials(): string {
    return this.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }
}

// ─── Participant extends User ─────────────────────────────────────────────────
// Demonstrates: Inheritance, super(), Constructor chaining

export class Participant extends User {
  public registrations: string[]

  constructor(
    id: number,
    name: string,
    email: string,
    phone: string | null,
    createdAt: Date,
    registrations: string[] = []
  ) {
    super(id, name, email, phone, createdAt) // calls User constructor
    this.registrations = registrations
  }

  get registrationCount(): number {
    return this.registrations.length
  }

  addRegistration(ticketId: string): void {
    this.registrations.push(ticketId)
  }

  removeRegistration(ticketId: string): void {
    this.registrations = this.registrations.filter((t) => t !== ticketId)
  }
}

// ─── Administrator extends User ───────────────────────────────────────────────
// Demonstrates: Inheritance, super(), Constructor chaining

export class Administrator extends User {
  public permissions: string[]

  constructor(
    id: number,
    name: string,
    email: string,
    phone: string | null,
    createdAt: Date,
    permissions: string[] = [
      "manage_events",
      "manage_venues",
      "manage_users",
      "view_reports",
    ]
  ) {
    super(id, name, email, phone, createdAt) // calls User constructor
    this.permissions = permissions
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission)
  }

  canManageEvents(): boolean {
    return this.hasPermission("manage_events")
  }

  canManageUsers(): boolean {
    return this.hasPermission("manage_users")
  }
}
