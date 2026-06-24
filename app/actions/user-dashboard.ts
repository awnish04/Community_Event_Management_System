/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { db } from "@/db"
import {
  events,
  venues,
  registrations,
  participants,
  users,
  eventVenues,
  eventActivities,
  activities,
} from "@/db/schema"
import { eq, sql, desc, gte } from "drizzle-orm"

// Get stats for the user dashboard
export async function getUserDashboardStats(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!user) return null

    const participant = await db.query.participants.findFirst({
      where: eq(participants.userId, user.id),
    })
    if (!participant) return null

    const userRegs = await db
      .select()
      .from(registrations)
      .where(eq(registrations.participantId, participant.id))

    // Also get system-wide events stats for "Discover" summary
    const allEvents = await db
      .select()
      .from(events)
      .where(gte(events.eventDate, new Date()))

    return {
      totalRegistrations: userRegs.length,
      confirmedRegistrations: userRegs.filter((r) => r.status === "confirmed")
        .length,
      upcomingEvents: allEvents.length,
      totalEvents: allEvents.length,
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

// Get all events for discovery, annotated with user registration status
export async function getDiscoverEvents(email: string) {
  try {
    // 1. Get all events
    const allEvents = await db
      .select({
        id: events.id,
        name: events.name,
        description: events.description,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        capacity: events.capacity,
        imageUrl: events.imageUrl,
        venueName: venues.name,
        venueId: venues.id,
      })
      .from(events)
      .leftJoin(eventVenues, eq(events.id, eventVenues.eventId))
      .leftJoin(venues, eq(eventVenues.venueId, venues.id))
      .orderBy(events.eventDate)

    // 2. Get registration counts
    const counts = await db
      .select({
        eventId: registrations.eventId,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(registrations)
      .where(sql`${registrations.status} IN ('pending', 'confirmed')`)
      .groupBy(registrations.eventId)
    const countMap = Object.fromEntries(
      counts.map((c) => [c.eventId, Number(c.count)])
    )

    // 3. Get activities per event
    const eventActs = await db
      .select({
        eventId: eventActivities.eventId,
        activityId: activities.id,
        activityName: activities.name,
        activityType: activities.type,
      })
      .from(eventActivities)
      .innerJoin(activities, eq(eventActivities.activityId, activities.id))

    const activityMap = new Map<number, any[]>()
    for (const act of eventActs) {
      if (!activityMap.has(act.eventId)) activityMap.set(act.eventId, [])
      activityMap.get(act.eventId)!.push({
        id: act.activityId,
        name: act.activityName,
        type: act.activityType,
      })
    }

    // 4. Get current user's registrations to mark "Registered" or "Pending"
    let userRegMap = new Map<number, string>()
    if (email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      })
      if (user) {
        const participant = await db.query.participants.findFirst({
          where: eq(participants.userId, user.id),
        })
        if (participant) {
          const userRegs = await db
            .select()
            .from(registrations)
            .where(eq(registrations.participantId, participant.id))
          userRegMap = new Map(userRegs.map((r) => [r.eventId, r.status]))
        }
      }
    }

    return allEvents.map((e) => {
      const registered = countMap[e.id] ?? 0
      return {
        id: String(e.id),
        name: e.name,
        description: e.description,
        eventDate: e.eventDate.toISOString().split("T")[0], // Keep as YYYY-MM-DD
        eventTime: e.eventTime,
        capacity: e.capacity,
        imageUrl: e.imageUrl,
        currentRegistrations: registered,
        isFull: registered >= e.capacity,
        venue: { id: String(e.venueId), name: e.venueName || "TBA" },
        activities: activityMap.get(e.id) || [],
        userRegistrationStatus: userRegMap.get(e.id) || null,
      }
    })
  } catch (err) {
    console.error(err)
    return []
  }
}

// Get specifically the events the user has registered for
export async function getUserRegistrations(email: string) {
  try {
    console.log("getUserRegistrations called with email:", email)

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    console.log("Found user:", user)
    if (!user) return []

    const participant = await db.query.participants.findFirst({
      where: eq(participants.userId, user.id),
    })
    console.log("Found participant:", participant)
    if (!participant) return []

    const regs = await db
      .select({
        id: registrations.id,
        eventId: registrations.eventId,
        status: registrations.status,
        ticketId: registrations.ticketId,
        qrCode: registrations.qrCode,
        registrationDate: registrations.registrationDate,
        eventName: events.name,
        eventDate: events.eventDate,
        eventTime: events.eventTime,
        venueName: venues.name,
        attendeeName: users.name,
        attendeeEmail: users.email,
      })
      .from(registrations)
      .innerJoin(events, eq(registrations.eventId, events.id))
      .innerJoin(participants, eq(registrations.participantId, participants.id))
      .innerJoin(users, eq(participants.userId, users.id))
      .leftJoin(eventVenues, eq(events.id, eventVenues.eventId))
      .leftJoin(venues, eq(eventVenues.venueId, venues.id))
      .where(eq(registrations.participantId, participant.id))
      .orderBy(desc(registrations.registrationDate))

    console.log("Found registrations:", regs.length, regs)

    return regs.map((r) => ({
      id: String(r.id),
      eventId: String(r.eventId),
      eventName: r.eventName,
      status: r.status.toUpperCase(),
      ticketId: r.ticketId || undefined,
      qrCode: r.qrCode || undefined,
      registrationDate: r.registrationDate.toISOString(),
      attendeeName: r.attendeeName,
      attendeeEmail: r.attendeeEmail,
      event: {
        eventDate: r.eventDate.toISOString(),
        eventTime: r.eventTime,
        venue: { name: r.venueName || "TBA" },
      },
    }))
  } catch (err) {
    console.error("Error in getUserRegistrations:", err)
    return []
  }
}
