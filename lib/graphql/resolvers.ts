/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError } from "graphql"
import { DateTimeResolver } from "graphql-scalars"
import { EventService } from "../services/EventService"
import { UserService } from "../services/UserService"
import { VenueRepository } from "../repositories/VenueRepository"
import { ActivityRepository } from "../repositories/ActivityRepository"
import { RegistrationRepository } from "../repositories/RegistrationRepository"
import {
  BaseException,
  UnauthorizedException,
  ForbiddenException,
} from "../exceptions/BaseException"

/**
 * GraphQL Resolvers
 * Demonstrates: GraphQL resolver pattern, business logic integration
 */

// Initialize services and repositories
const eventService = new EventService()
const userService = new UserService()
const venueRepository = new VenueRepository()
const activityRepository = new ActivityRepository()
const registrationRepository = new RegistrationRepository()

// Context type
interface Context {
  user?: {
    id: number
    email: string
    role: string
  }
}

// Helper function to require authentication
function requireAuth(context: Context) {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" },
    })
  }
  return context.user
}

// Helper function to require admin role
function requireAdmin(context: Context) {
  const user = requireAuth(context)
  if (user.role !== "admin") {
    throw new GraphQLError("Admin access required", {
      extensions: { code: "FORBIDDEN" },
    })
  }
  return user
}

// Helper to handle errors
function handleError(error: any) {
  if (error instanceof BaseException) {
    throw new GraphQLError(error.message, {
      extensions: {
        code: error.name,
        statusCode: error.statusCode,
        ...(error instanceof BaseException && "errors" in error
          ? { errors: (error as any).errors }
          : {}),
      },
    })
  }
  throw error
}

export const resolvers = {
  DateTime: DateTimeResolver,

  Query: {
    // User queries
    me: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context)
      try {
        return await userService.getUserById(user.id)
      } catch (error) {
        handleError(error)
      }
    },

    user: async (_: any, { id }: { id: string }, context: Context) => {
      requireAuth(context)
      try {
        return await userService.getUserById(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    users: async (_: any, __: any, context: Context) => {
      requireAdmin(context)
      try {
        return await userService.getAllUsers()
      } catch (error) {
        handleError(error)
      }
    },

    // Event queries
    event: async (_: any, { id }: { id: string }) => {
      try {
        return await eventService.getEventById(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    events: async () => {
      try {
        return await eventService.getAllEvents()
      } catch (error) {
        handleError(error)
      }
    },

    upcomingEvents: async () => {
      try {
        return await eventService.getUpcomingEvents()
      } catch (error) {
        handleError(error)
      }
    },

    filterEvents: async (_: any, { filter }: { filter: any }) => {
      try {
        return await eventService.filterEvents(filter)
      } catch (error) {
        handleError(error)
      }
    },

    eventStatistics: async (
      _: any,
      { eventId }: { eventId: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await eventService.getEventStatistics(parseInt(eventId))
      } catch (error) {
        handleError(error)
      }
    },

    // Venue queries
    venue: async (_: any, { id }: { id: string }) => {
      try {
        return await venueRepository.findById(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    venues: async () => {
      try {
        return await venueRepository.findAll()
      } catch (error) {
        handleError(error)
      }
    },

    // Activity queries
    activity: async (_: any, { id }: { id: string }) => {
      try {
        return await activityRepository.findById(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    activities: async () => {
      try {
        return await activityRepository.findAll()
      } catch (error) {
        handleError(error)
      }
    },

    activitiesByType: async (_: any, { type }: { type: string }) => {
      try {
        return await activityRepository.findByType(type as any)
      } catch (error) {
        handleError(error)
      }
    },

    // Registration queries
    registration: async (_: any, { id }: { id: string }, context: Context) => {
      requireAuth(context)
      try {
        return await registrationRepository.findById(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    myRegistrations: async (_: any, __: any, context: Context) => {
      const user = requireAuth(context)
      try {
        // Note: This assumes participantId = userId (you may need to adjust)
        return await registrationRepository.findByParticipant(user.id)
      } catch (error) {
        handleError(error)
      }
    },

    eventRegistrations: async (
      _: any,
      { eventId }: { eventId: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await registrationRepository.findByEvent(parseInt(eventId))
      } catch (error) {
        handleError(error)
      }
    },
  },

  Mutation: {
    // Authentication
    register: async (_: any, { input }: { input: any }) => {
      try {
        const user = await userService.registerUser(input)
        // In production, generate a real JWT token
        const token = `fake-jwt-token-${user.id}`
        return { user, token }
      } catch (error) {
        handleError(error)
      }
    },

    login: async (_: any, { input }: { input: any }) => {
      try {
        const user = await userService.authenticateUser(
          input.email,
          input.password
        )
        // In production, generate a real JWT token
        const token = `fake-jwt-token-${user.id}`
        return { user, token }
      } catch (error) {
        handleError(error)
      }
    },

    // Event mutations
    createEvent: async (
      _: any,
      { input }: { input: any },
      context: Context
    ) => {
      const user = requireAdmin(context)
      try {
        return await eventService.createEvent({
          ...input,
          eventDate: new Date(input.eventDate),
          venueId: input.venueId ? parseInt(input.venueId) : undefined,
          createdBy: user.id,
        })
      } catch (error) {
        handleError(error)
      }
    },

    updateEvent: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await eventService.updateEvent(parseInt(id), {
          ...input,
          eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
          venueId: input.venueId ? parseInt(input.venueId) : undefined,
        })
      } catch (error) {
        handleError(error)
      }
    },

    deleteEvent: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context)
      try {
        return await eventService.deleteEvent(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    // Venue mutations
    createVenue: async (
      _: any,
      { input }: { input: any },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await venueRepository.create(input)
      } catch (error) {
        handleError(error)
      }
    },

    updateVenue: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await venueRepository.update(parseInt(id), input)
      } catch (error) {
        handleError(error)
      }
    },

    deleteVenue: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context)
      try {
        return await venueRepository.delete(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    // Activity mutations
    createActivity: async (
      _: any,
      { input }: { input: any },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await activityRepository.create(input)
      } catch (error) {
        handleError(error)
      }
    },

    updateActivity: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await activityRepository.update(parseInt(id), input)
      } catch (error) {
        handleError(error)
      }
    },

    deleteActivity: async (
      _: any,
      { id }: { id: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await activityRepository.delete(parseInt(id))
      } catch (error) {
        handleError(error)
      }
    },

    // Registration mutations
    registerForEvent: async (
      _: any,
      { eventId }: { eventId: string },
      context: Context
    ) => {
      const user = requireAuth(context)
      try {
        // Note: This assumes participantId = userId
        await eventService.registerForEvent(user.id, parseInt(eventId))
        const registration = await registrationRepository.findByParticipant(
          user.id
        )
        return registration[registration.length - 1] // Return the latest registration
      } catch (error) {
        handleError(error)
      }
    },

    cancelRegistration: async (
      _: any,
      { eventId }: { eventId: string },
      context: Context
    ) => {
      const user = requireAuth(context)
      try {
        return await registrationRepository.unregister(
          user.id,
          parseInt(eventId)
        )
      } catch (error) {
        handleError(error)
      }
    },

    // Admin mutations
    promoteToAdmin: async (
      _: any,
      { userId }: { userId: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await userService.promoteToAdmin(parseInt(userId))
      } catch (error) {
        handleError(error)
      }
    },

    demoteToUser: async (
      _: any,
      { userId }: { userId: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await userService.demoteToUser(parseInt(userId))
      } catch (error) {
        handleError(error)
      }
    },

    updateRegistrationStatus: async (
      _: any,
      { registrationId, status }: { registrationId: string; status: string },
      context: Context
    ) => {
      requireAdmin(context)
      try {
        return await registrationRepository.update(parseInt(registrationId), {
          status: status as any,
        })
      } catch (error) {
        handleError(error)
      }
    },
  },

  // Field resolvers
  Event: {
    venue: async (parent: any) => {
      if (!parent.venueId) return null
      return await venueRepository.findById(parent.venueId)
    },
    registrations: async (parent: any) => {
      return await registrationRepository.findByEvent(parent.id)
    },
  },

  Registration: {
    participant: async (parent: any) => {
      return await userService.getUserById(parent.participantId)
    },
    event: async (parent: any) => {
      return await eventService.getEventById(parent.eventId)
    },
  },
}
