// ─── Dependency Injection Container ──────────────────────────────────────────
// This file wires concrete implementations to their interfaces.
// Server actions import services from here — they never instantiate
// repositories or services directly, demonstrating true DI.
//
// Demonstrates:
//   ✅ Dependency Injection (constructor injection via new Service(repo))
//   ✅ Inversion of Control (services depend on interfaces, not concrete classes)
//   ✅ Single source of truth for dependency wiring

import { EventRepository } from "@/src/repositories/EventRepository"
import { UserRepository } from "@/src/repositories/UserRepository"
import { RegistrationRepository } from "@/src/repositories/RegistrationRepository"
import { EventService } from "@/src/services/EventService"
import { UserService } from "@/src/services/UserService"
import { RegistrationService } from "@/src/services/RegistrationService"

// ── Instantiate repositories ──────────────────────────────────────────────────
const eventRepository = new EventRepository()
const userRepository = new UserRepository()
const registrationRepository = new RegistrationRepository()

// ── Inject repositories into services ────────────────────────────────────────
export const eventService = new EventService(eventRepository)
export const userService = new UserService(userRepository)
export const registrationService = new RegistrationService(
  registrationRepository,
  eventRepository,
  userRepository
)
