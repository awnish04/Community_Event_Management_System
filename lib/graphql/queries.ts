/**
 * GraphQL Queries
 * Demonstrates: GraphQL query definitions for reuse
 */

// User Queries
export const GET_ME = `
  query GetMe {
    me {
      id
      name
      email
      phone
      role
      createdAt
    }
  }
`

export const GET_USER = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      role
      createdAt
    }
  }
`

export const GET_USERS = `
  query GetUsers {
    users {
      id
      name
      email
      role
      createdAt
    }
  }
`

// Event Queries
export const GET_EVENT = `
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      description
      eventDate
      eventTime
      capacity
      currentRegistrations
      availableSpots
      isFull
      isUpcoming
      occupancyPercentage
      venue {
        id
        name
        address
        capacity
      }
      creator {
        id
        name
        email
      }
      createdAt
    }
  }
`

export const GET_EVENTS = `
  query GetEvents {
    events {
      id
      name
      description
      eventDate
      eventTime
      capacity
      currentRegistrations
      availableSpots
      isFull
      isUpcoming
      venue {
        id
        name
      }
      createdAt
    }
  }
`

export const GET_UPCOMING_EVENTS = `
  query GetUpcomingEvents {
    upcomingEvents {
      id
      name
      description
      eventDate
      eventTime
      capacity
      currentRegistrations
      availableSpots
      isFull
      venue {
        id
        name
        address
      }
      createdAt
    }
  }
`

export const FILTER_EVENTS = `
  query FilterEvents($filter: EventFilterInput!) {
    filterEvents(filter: $filter) {
      id
      name
      description
      eventDate
      eventTime
      capacity
      currentRegistrations
      availableSpots
      isFull
      venue {
        id
        name
      }
    }
  }
`

export const GET_EVENT_STATISTICS = `
  query GetEventStatistics($eventId: ID!) {
    eventStatistics(eventId: $eventId) {
      eventId
      eventName
      capacity
      totalRegistrations
      confirmedRegistrations
      pendingRegistrations
      cancelledRegistrations
      waitlistRegistrations
      availableSpots
      occupancyPercentage
      isFull
    }
  }
`

// Venue Queries
export const GET_VENUE = `
  query GetVenue($id: ID!) {
    venue(id: $id) {
      id
      name
      address
      capacity
      description
      createdAt
    }
  }
`

export const GET_VENUES = `
  query GetVenues {
    venues {
      id
      name
      address
      capacity
      description
    }
  }
`

// Activity Queries
export const GET_ACTIVITY = `
  query GetActivity($id: ID!) {
    activity(id: $id) {
      id
      name
      description
      type
      createdAt
    }
  }
`

export const GET_ACTIVITIES = `
  query GetActivities {
    activities {
      id
      name
      description
      type
    }
  }
`

export const GET_ACTIVITIES_BY_TYPE = `
  query GetActivitiesByType($type: ActivityType!) {
    activitiesByType(type: $type) {
      id
      name
      description
      type
    }
  }
`

// Registration Queries
export const GET_MY_REGISTRATIONS = `
  query GetMyRegistrations {
    myRegistrations {
      id
      status
      registrationDate
      isActive
      event {
        id
        name
        description
        eventDate
        eventTime
        venue {
          name
          address
        }
      }
    }
  }
`

export const GET_EVENT_REGISTRATIONS = `
  query GetEventRegistrations($eventId: ID!) {
    eventRegistrations(eventId: $eventId) {
      id
      status
      registrationDate
      participant {
        id
        name
        email
      }
    }
  }
`
