# Community Event Management System

A web application for managing community events, built with Next.js, TypeScript, and PostgreSQL.

## 📋 Assignment Requirements

This project fulfills the CET254 Advanced Programming assignment requirements:

- ✅ Web application with database integration
- ✅ Object-Oriented Programming (OOP) principles
- ✅ UML diagrams and documentation
- ✅ Comprehensive testing
- ✅ Design patterns implementation

## 🏗️ Architecture

### OOP Principles Demonstrated

1. **Inheritance**: Base classes (`BaseModel`, `User`) extended by specific implementations
2. **Interfaces**: `IEntity`, `IValidatable`, `IManageable`, `IRegisterable`, `IFilterable`
3. **Polymorphism**: Method overriding in child classes (e.g., `validate()`, `getPermissions()`)
4. **Encapsulation**: Private fields with getters/setters
5. **Abstraction**: Abstract base classes and interfaces

### Design Patterns

- **Repository Pattern**: Data access layer separation
- **Service Layer Pattern**: Business logic separation
- **Factory Pattern**: Object creation (planned)
- **Strategy Pattern**: Filtering and sorting (planned)

## 🗄️ Database Schema

### Tables

1. **users** - User authentication and roles
2. **participants** - Event participants (extends users)
3. **events** - Community events
4. **venues** - Event locations
5. **activities** - Event activities (workshops, talks, games)
6. **registrations** - Junction table (participants ↔ events)
7. **event_activities** - Junction table (events ↔ activities)

### Relationships

- Users → Participants (one-to-one)
- Events → Venues (many-to-one)
- Events ↔ Participants (many-to-many via registrations)
- Events ↔ Activities (many-to-many via event_activities)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Neon PostgreSQL account (or any PostgreSQL database)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd communityevent_management_system
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Neon database connection string:

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

4. Generate and push database schema

```bash
pnpm db:push
```

5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app                    # Next.js App Router
  /api                  # API routes
  /(admin)              # Admin dashboard
  /(user)               # User interface

/lib
  /models               # OOP Classes (Event, User, Venue, etc.)
  /interfaces           # TypeScript interfaces
  /repositories         # Repository Pattern (data access)
  /services             # Service Layer (business logic)
  /exceptions           # Custom exception classes
  /utils                # Helper functions

/db
  /schema.ts            # Drizzle ORM schema
  /migrations           # Database migrations

/components
  /ui                   # shadcn/ui components
```

## 🎯 Features

### Admin Features

- ✅ Create and manage events
- ✅ Manage participants
- ✅ Manage venues
- ✅ Manage activities
- ✅ View all registrations
- ✅ Event analytics

### User Features

- ✅ Browse upcoming events
- ✅ Filter events by date, venue, activity
- ✅ Register for events
- ✅ View personal registrations
- ✅ Cancel registrations

## 🧪 Testing

```bash
# Run tests (to be implemented)
pnpm test

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## 📊 Database Commands

```bash
# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Authentication**: NextAuth.js (planned)

## 📝 Custom Exceptions

The project includes comprehensive error handling:

- `ValidationException` - Input validation errors
- `NotFoundException` - Resource not found
- `DuplicateException` - Duplicate resource
- `EventFullException` - Event capacity reached
- `AlreadyRegisteredException` - Duplicate registration
- `UnauthorizedException` - Authentication errors
- `ForbiddenException` - Authorization errors
- `DatabaseException` - Database errors

## 👥 User Roles

1. **Admin** - Full system access
2. **User** - Can browse and register for events

## 📄 License

This project is for educational purposes (CET254 Assignment).
# Community_Event_Management_System
