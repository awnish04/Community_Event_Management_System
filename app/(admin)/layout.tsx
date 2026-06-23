import type { ReactNode } from "react"
import { AdminShell } from "@/components/admin/dashboard/AdminShell"
import { Toaster } from "sonner"
import { cookies } from "next/headers"

export const metadata = {
  title: "Admin — EventHub",
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const adminEmail = cookieStore.get("adminEmail")?.value ?? "admin@eventhub.com"
  const adminName = cookieStore.get("adminName")?.value ?? "Admin"

  const sessionUser = {
    name: adminName,
    email: adminEmail,
    avatar: "",
  }

  return (
    <>
      <Toaster position="top-center" richColors closeButton={false} />
      <AdminShell user={sessionUser}>{children}</AdminShell>
    </>
  )
}
