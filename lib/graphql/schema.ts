/**
 * GraphQL Schema Definition
 * Demonstrates: GraphQL type system, schema design
 */

export const typeDefs = /* GraphQL */ `
  scalar DateTime

  # Enums
  enum UserRole {
    ADMIN
    USER
  }

  enum RegistrationStatus {
    PENDING
    CONFIRMED
    CANCELLED
    WAITLIST
  }

  enum ActivityType {
    WORKSHOP
    TALK
    GAME
    NETWORKING
    PANEL
    OTHER
  }

  # Types
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Event {
    id: ID!
    name: String!
    description: String!
    eventDate: DateTime!
    eventTime: String!
    capacity: Int!
    currentRegistrations: Int!
    availableSpots: Int!
    isFull: Boolean!
    isUpcoming: Boolean!
    occupancyPercentage: Float!
    venue: Venue
    activities: [Activity!]!
    registrations: [Registration!]!
    creator: User
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Venue {
    id: ID!
    name: String!
    address: String!
    capacity: Int!
    description: String
    events: [Event!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Activity {
    id: ID!
    name: String!
    description: String
    type: ActivityType!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Registration {
    id: ID!
    participant: User!
    event: Event!
    status: RegistrationStatus!
    registrationDate: DateTime!
    isActive: Boolean!
    isCancelled: Boolean!
    isWaitlisted: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type EventStatistics {
    eventId: ID!
    eventName: String!
    capacity: Int!
    totalRegistrations: Int!
    confirmedRegistrations: Int!
    pendingRegistrations: Int!
    cancelledRegistrations: Int!
    waitlistRegistrations: Int!
    availableSpots: Int!
    occupancyPercentage: Float!
    isFull: Boolean!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  # Input Types
  input CreateEventInput {
    name: String!
    description: String!
    eventDate: DateTime!
    eventTime: String!
    venueId: ID
    capacity: Int!
    activityIds: [ID!]
  }

  input UpdateEventInput {
    name: String
    description: String
    eventDate: DateTime
    eventTime: String
    venueId: ID
    capacity: Int
  }

  input CreateVenueInput {
    name: String!
    address: String!
    capacity: Int!
    description: String
  }

  input UpdateVenueInput {
    name: String
    address: String
    capacity: Int
    description: String
  }

  input CreateActivityInput {
    name: String!
    description: String
    type: ActivityType!
  }

  input UpdateActivityInput {
    name: String
    description: String
    type: ActivityType
  }

  input RegisterUserInput {
    name: String!
    email: String!
    phone: String
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EventFilterInput {
    venueId: ID
    fromDate: DateTime
    upcomingOnly: Boolean
    activityType: ActivityType
  }

  # Queries
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!

    # Event queries
    event(id: ID!): Event
    events: [Event!]!
    upcomingEvents: [Event!]!
    filterEvents(filter: EventFilterInput!): [Event!]!
    eventStatistics(eventId: ID!): EventStatistics!

    # Venue queries
    venue(id: ID!): Venue
    venues: [Venue!]!

    # Activity queries
    activity(id: ID!): Activity
    activities: [Activity!]!
    activitiesByType(type: ActivityType!): [Activity!]!

    # Registration queries
    registration(id: ID!): Registration
    myRegistrations: [Registration!]!
    eventRegistrations(eventId: ID!): [Registration!]!
  }

  # Mutations
  type Mutation {
    # Authentication
    register(input: RegisterUserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Event mutations
    createEvent(input: CreateEventInput!): Event!
    updateEvent(id: ID!, input: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Boolean!

    # Venue mutations
    createVenue(input: CreateVenueInput!): Venue!
    updateVenue(id: ID!, input: UpdateVenueInput!): Venue!
    deleteVenue(id: ID!): Boolean!

    # Activity mutations
    createActivity(input: CreateActivityInput!): Activity!
    updateActivity(id: ID!, input: UpdateActivityInput!): Activity!
    deleteActivity(id: ID!): Boolean!

    # Registration mutations
    registerForEvent(eventId: ID!): Registration!
    cancelRegistration(eventId: ID!): Boolean!

    # Admin mutations
    promoteToAdmin(userId: ID!): User!
    demoteToUser(userId: ID!): User!
    updateRegistrationStatus(
      registrationId: ID!
      status: RegistrationStatus!
    ): Registration!
  }
`
