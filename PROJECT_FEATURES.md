# Community Event Management System — Features & Diagram Guide

---

## Assignment UML Requirements

The marking criteria states **"UML Diagram(s) representing the system"**.
To achieve a 1st, diagrams must show correct structure, relationships, and convey complex concepts with precision.

**You should produce three diagrams:**

| #   | Diagram              | Purpose                                                                | Mark Relevance                      |
| --- | -------------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| 1   | **Class Diagram**    | Shows all classes, interfaces, inheritance, methods, and relationships | OOP Implementation, Design Patterns |
| 2   | **ER Diagram**       | Shows all database tables, columns, and foreign key relationships      | Data Structures, Architecture       |
| 3   | **Use Case Diagram** | Shows actors and what they can do in the system                        | Scope & Functionality               |

> A sequence diagram showing the registration flow (Server Action → Service → Repository → DB) would strengthen the Design Patterns mark further.

---

## System Features

### 1. Authentication & Authorisation

- **User Registration:** Users create accounts with name, email, and password. A `Participant` row is auto-created on the same request.
- **User Login:** Email and password authentication. Session stored in browser cookies and `localStorage`.
- **Admin Login:** Separate login portal for the single administrator. Uses a dedicated `administrators` table.
- **Role Separation:** `USER` and `ADMIN` roles enforced server-side via cookie checks on every protected page. Unauthenticated requests are redirected to the appropriate login page.
- **Logout:** Manual only — clears all cookies and `localStorage`. No automatic session expiry.

### 2. Event Management (Admin)

- **Create Event:** Name, description, date, time, capacity. Optionally link a venue and activities via the `EventService`.
- **Edit Event:** Full update including venue and activity re-assignment.
- **Delete Event:** Cascade-deletes all associated registrations.
- **View Events:** Table of all events with linked venue and activity data.

### 3. Venue Management (Admin)

- **Create / Edit / Delete / View** physical venues (name, address, capacity, description).

### 4. Activity Management (Admin)

- **Create / Edit / Delete / View** sub-activities (name, description, type: Workshop / Talk / Game / Exhibition).

### 5. Participants Dashboard (Admin)

- **View All Registrations:** Every registration across all events — participant name, email, event name, ticket ID, quantity, status, and date.
- **Delete Registrations:** Admin can remove any registration.
- **Dashboard Stats:** Total events, upcoming events, total users, new users this month, total venues, total activities, total registrations, confirmed registrations.

### 6. Event Registration & Ticketing (User)

- **Browse Events:** All upcoming events with venue, capacity indicator, and activity tags.
- **Register for Event:** One-click registration. The system:
  - Checks capacity — throws `EventFullException` if at limit
  - Prevents duplicates — throws `DuplicateRegistrationException`
  - Generates a unique Ticket ID via `TicketFactory` (`TKT-{timestamp}-{random}`)
  - Generates a scannable QR code (URL format readable by phone cameras)
  - Stores registration as `confirmed` immediately
- **Cancel Registration:** Allowed within 12 hours of registering.
- **User Dashboard:** Personal stats — total registrations, confirmed registrations, upcoming events.
- **My Registrations:** Table of all registered events with ticket ID, venue, date/time.
- **View / Download Ticket:** Eye icon generates and opens a PDF ticket in a new tab — shows event details, attendee name, ticket ID, and QR code.

---

## Guide for Diagrams

### Actors (Use Case Diagram)

| Actor                  | Actions                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **User / Participant** | Register account, Log in, Browse events, Register for event, Cancel registration, View/download ticket                                   |
| **Administrator**      | Log in, Create/edit/delete events, Create/edit/delete venues, Create/edit/delete activities, View all participants, Delete registrations |
| **System**             | Auto-generate Ticket ID, Auto-generate QR code, Enforce capacity limits, Enforce duplicate prevention                                    |

---

### Database Entities (ER Diagram)

| Table              | Columns                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`            | `id`, `name`, `email`, `password`, `createdAt`, `updatedAt`                                                                                   |
| `administrators`   | `id`, `name`, `email`, `password`, `createdAt`, `updatedAt`                                                                                   |
| `participants`     | `id`, `userId` (FK → users), `bio`, `createdAt`, `updatedAt`                                                                                  |
| `events`           | `id`, `name`, `description`, `eventDate`, `eventTime`, `capacity`, `status`, `createdBy` (FK → administrators), `createdAt`, `updatedAt`      |
| `venues`           | `id`, `name`, `address`, `capacity`, `description`, `createdAt`, `updatedAt`                                                                  |
| `activities`       | `id`, `name`, `description`, `type`, `createdAt`, `updatedAt`                                                                                 |
| `registrations`    | `id`, `participantId` (FK), `eventId` (FK), `status`, `quantity`, `ticketId` (unique), `qrCode`, `registrationDate`, `createdAt`, `updatedAt` |
| `event_venues`     | `id`, `eventId` (FK), `venueId` (FK) — join table                                                                                             |
| `event_activities` | `id`, `eventId` (FK), `activityId` (FK) — join table                                                                                          |

**Relationships:**

- `User` (1) → `Participant` (1) — one-to-one
- `Administrator` (1) → `Event` (Many)
- `Participant` (1) → `Registration` (Many)
- `Event` (1) → `Registration` (Many)
- `Event` (Many) ↔ `Venue` (Many) — via `event_venues`
- `Event` (Many) ↔ `Activity` (Many) — via `event_activities`

---

### Class Diagram Entities

**Domain Models — Inheritance:**

- `User` — `id`, `name`, `email`, `createdAt` | `getInitials()`, `toProfile()`
- `Participant extends User` — `registrations: string[]` | `addRegistration()`, `removeRegistration()`, `registrationCount`
- `Administrator extends User` — `permissions: string[]` | `hasPermission()`, `canManageEvents()`, `canManageUsers()`

**Factory:**

- `TicketFactory` — `generateId(): string` (static)

**Custom Exceptions** (all extend `AppException extends Error`):

- `EventFullException` (409)
- `DuplicateRegistrationException` (409)
- `EventNotFoundException` (404)
- `RegistrationNotFoundException` (404)
- `UserNotFoundException` (404)
- `DuplicateEmailException` (409)
- `UnauthorizedAccessException` (403)
- `InvalidCredentialsException` (401)

**Repository Interfaces → Implementations:**

- `IEventRepository` → `EventRepository`
- `IUserRepository` → `UserRepository`
- `IRegistrationRepository` → `RegistrationRepository`

**Services (constructor Dependency Injection):**

- `EventService(repo: IEventRepository)` — `createEvent`, `updateEvent`, `deleteEvent`
- `UserService(repo: IUserRepository)` — `createUser`, `validateCredentials`, `deleteUser`
- `RegistrationService(regRepo, eventRepo, userRepo)` — `registerForEvent`, `cancelRegistration`, `regenerateTicket`

**Server Actions (UI entry points):**

- `registrations.ts` → `registerForEvent`, `deleteRegistration`, `generateTicketForRegistration`
- `events.ts` → `createEvent`, `editEvent`, `deleteEvent`, `createVenue`, `editVenue`, `deleteVenue`
- `activities.ts` → `createActivity`, `editActivity`, `deleteActivity`

**DTOs:**

- `CreateEventDto`, `UpdateEventDto`, `EventDto`
- `CreateUserDto`, `UpdateUserDto`, `UserDto`
- `CreateRegistrationDto`, `UpdateRegistrationDto`, `RegistrationDto`

---

## OOP Concepts to Highlight in Demonstration

| Concept              | Where to Show                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| Inheritance          | `src/domain/models/User.ts` — `Participant extends User`, `Administrator extends User`            |
| Interfaces           | `src/repositories/interfaces/` — `IEventRepository`, `IUserRepository`, `IRegistrationRepository` |
| Polymorphism         | `app/actions/registrations.ts` — `instanceof` checks for each typed exception                     |
| Dependency Injection | `src/container.ts` — repositories injected into services via constructors                         |
| Factory Pattern      | `src/domain/models/Ticket.ts` — `TicketFactory.generateId()`                                      |
| Custom Exceptions    | `src/domain/exceptions/AppExceptions.ts` — full inheritance chain from `Error`                    |
| Repository Pattern   | `src/repositories/` — all DB queries isolated, services depend on interfaces                      |
| Encapsulation        | All service constructors use `private readonly` for injected dependencies                         |
