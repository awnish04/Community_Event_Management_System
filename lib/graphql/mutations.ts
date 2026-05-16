/**
 * GraphQL Mutations
 * Demonstrates: GraphQL mutation definitions for reuse
 */

// Authentication Mutations
export const REGISTER_USER = `
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        role
      }
      token
    }
  }
`

export const LOGIN = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        role
      }
      token
    }
  }
`

// Event Mutations
export const CREATE_EVENT = `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      name
      description
      eventDate
      eventTime
      capacity
      venue {
        id
        name
      }
      createdAt
    }
  }
`

export const UPDATE_EVENT = `
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      name
      description
      eventDate
      eventTime
      capacity
      venue {
        id
        name
      }
      updatedAt
    }
  }
`

export const DELETE_EVENT = `
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`

// Venue Mutations
export const CREATE_VENUE = `
  mutation CreateVenue($input: CreateVenueInput!) {
    createVenue(input: $input) {
      id
      name
      address
      capacity
      description
      createdAt
    }
  }
`

export const UPDATE_VENUE = `
  mutation UpdateVenue($id: ID!, $input: UpdateVenueInput!) {
    updateVenue(id: $id, input: $input) {
      id
      name
      address
      capacity
      description
      updatedAt
    }
  }
`

export const DELETE_VENUE = `
  mutation DeleteVenue($id: ID!) {
    deleteVenue(id: $id)
  }
`

// Activity Mutations
export const CREATE_ACTIVITY = `
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
      id
      name
      description
      type
      createdAt
    }
  }
`

export const UPDATE_ACTIVITY = `
  mutation UpdateActivity($id: ID!, $input: UpdateActivityInput!) {
    updateActivity(id: $id, input: $input) {
      id
      name
      description
      type
      updatedAt
    }
  }
`

export const DELETE_ACTIVITY = `
  mutation DeleteActivity($id: ID!) {
    deleteActivity(id: $id)
  }
`

// Registration Mutations
export const REGISTER_FOR_EVENT = `
  mutation RegisterForEvent($eventId: ID!) {
    registerForEvent(eventId: $eventId) {
      id
      status
      registrationDate
      event {
        id
        name
        eventDate
      }
    }
  }
`

export const CANCEL_REGISTRATION = `
  mutation CancelRegistration($eventId: ID!) {
    cancelRegistration(eventId: $eventId)
  }
`

// Admin Mutations
export const PROMOTE_TO_ADMIN = `
  mutation PromoteToAdmin($userId: ID!) {
    promoteToAdmin(userId: $userId) {
      id
      name
      email
      role
    }
  }
`

export const DEMOTE_TO_USER = `
  mutation DemoteToUser($userId: ID!) {
    demoteToUser(userId: $userId) {
      id
      name
      email
      role
    }
  }
`

export const UPDATE_REGISTRATION_STATUS = `
  mutation UpdateRegistrationStatus($registrationId: ID!, $status: RegistrationStatus!) {
    updateRegistrationStatus(registrationId: $registrationId, status: $status) {
      id
      status
      updatedAt
    }
  }
`
