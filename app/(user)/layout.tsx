import type { ReactNode } from "react"
import { UserShell } from "@/components/user/dashboard/UserShell"
import { Toaster } from "sonner"

export const metadata = {
  title: "User Dashboard — EventHub",
}

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors closeButton={false} />
      <UserShell>{children}</UserShell>
    </>
  )
}
