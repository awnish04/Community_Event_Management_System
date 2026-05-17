"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function editUserRole(id: number, role: "admin" | "user") {
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id))
  revalidatePath("/admin/participants")
}

export async function deleteUser(id: number) {
  // Cascades to participants, registrations, etc. based on schema setup
  await db.delete(users).where(eq(users.id, id))
  revalidatePath("/admin/participants")
}
