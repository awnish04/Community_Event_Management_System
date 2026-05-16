import type { ReactNode } from "react"
import { AdminShell } from "@/components/admin/dashboard/AdminShell"
import { Toaster } from "sonner"

export const metadata = {
  title: "Admin — EventHub",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const sessionUser = {
    name: "Admin User",
    email: "admin@eventhub.com",
    avatar: "",
  }

  return (
    <>
      <Toaster position="top-center" richColors closeButton={false} />
      <AdminShell user={sessionUser}>{children}</AdminShell>
    </>
  )
}
