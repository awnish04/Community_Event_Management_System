import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Administrators ───────────────────────────────────────────────────────────
// Separate table — only one administrator account exists in the system.
// Created once via db:push + manual insert (or the setup route).
export const administrators = pgTable("administrators", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Users ────────────────────────────────────────────────────────────────────
// Regular (non-admin) accounts. Created on public registration.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Participants ─────────────────────────────────────────────────────────────
// One participant row per user — created automatically on registration.
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Venues ───────────────────────────────────────────────────────────────────
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Activities ───────────────────────────────────────────────────────────────
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // workshop, talk, game, exhibition…
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Events ───────────────────────────────────────────────────────────────────
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventTime: varchar("event_time", { length: 50 }).notNull(),
  capacity: integer("capacity").notNull(),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  createdBy: integer("created_by").references(() => administrators.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Registrations (Participants ↔ Events) ────────────────────────────────────
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id")
    .references(() => participants.id, { onDelete: "cascade" })
    .notNull(),
  eventId: integer("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", { length: 50 }).default("confirmed").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  ticketId: varchar("ticket_id", { length: 255 }).unique(),
  qrCode: text("qr_code"),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Event ↔ Activities (many-to-many) ───────────────────────────────────────
export const eventActivities = pgTable("event_activities", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  activityId: integer("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Event ↔ Venues (many-to-many) ───────────────────────────────────────────
export const eventVenues = pgTable("event_venues", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  venueId: integer("venue_id")
    .references(() => venues.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Relations ────────────────────────────────────────────────────────────────
export const administratorsRelations = relations(
  administrators,
  ({ many }) => ({
    createdEvents: many(events),
  })
)

export const usersRelations = relations(users, ({ one }) => ({
  participant: one(participants, {
    fields: [users.id],
    references: [participants.userId],
  }),
}))

export const participantsRelations = relations(
  participants,
  ({ one, many }) => ({
    user: one(users, {
      fields: [participants.userId],
      references: [users.id],
    }),
    registrations: many(registrations),
  })
)

export const venuesRelations = relations(venues, ({ many }) => ({
  eventVenues: many(eventVenues),
}))

export const activitiesRelations = relations(activities, ({ many }) => ({
  eventActivities: many(eventActivities),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(administrators, {
    fields: [events.createdBy],
    references: [administrators.id],
  }),
  registrations: many(registrations),
  eventActivities: many(eventActivities),
  eventVenues: many(eventVenues),
}))

export const registrationsRelations = relations(registrations, ({ one }) => ({
  participant: one(participants, {
    fields: [registrations.participantId],
    references: [participants.id],
  }),
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}))

export const eventActivitiesRelations = relations(
  eventActivities,
  ({ one }) => ({
    event: one(events, {
      fields: [eventActivities.eventId],
      references: [events.id],
    }),
    activity: one(activities, {
      fields: [eventActivities.activityId],
      references: [activities.id],
    }),
  })
)

export const eventVenuesRelations = relations(eventVenues, ({ one }) => ({
  event: one(events, {
    fields: [eventVenues.eventId],
    references: [events.id],
  }),
  venue: one(venues, {
    fields: [eventVenues.venueId],
    references: [venues.id],
  }),
}))
