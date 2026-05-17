"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { activities } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createActivity(formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const type = (formData.get("type") as string) || null

  if (!name) {
    throw new Error("Activity name is required.")
  }

  await db.insert(activities).values({ name, description, type })

  revalidatePath("/admin/activities")
}

export async function deleteActivity(id: number) {
  await db.delete(activities).where(eq(activities.id, id))
  revalidatePath("/admin/activities")
}

export async function editActivity(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const description = (formData.get("description") as string) || null
  const type = (formData.get("type") as string) || null

  if (!name) {
    throw new Error("Activity name is required.")
  }

  await db.update(activities).set({ name, description, type, updatedAt: new Date() }).where(eq(activities.id, id))

  revalidatePath("/admin/activities")
}
