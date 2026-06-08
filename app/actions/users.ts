"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

// Delete a user (cascades to their participant + registrations)
export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id))
  revalidatePath("/admin/participants")
}
