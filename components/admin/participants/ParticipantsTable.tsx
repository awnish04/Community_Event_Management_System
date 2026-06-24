"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteRegistration } from "@/app/actions/registrations"

interface Registration {
  id: number
  registrationDate: Date
  userName: string
  userEmail: string
  userPhone: string | null
  eventName: string
  status: string
  quantity: number
  ticketId: string | null
  qrCode: string | null
}

function DeleteRegistrationDialog({ reg }: { reg: Registration }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteRegistration(reg.id)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Delete Participant</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Participant Registration</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the registration of{" "}
            <strong>{reg.userName}</strong> for the event{" "}
            <strong>{reg.eventName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ParticipantsTable({
  registrations,
}: {
  registrations: Registration[]
}) {
  const [search, setSearch] = useState("")

  const filtered = registrations.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      (r.ticketId && r.ticketId.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Participants</CardTitle>
          <CardDescription>
            {registrations.length} registrations total • Tickets automatically
            generated on registration
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by participant name, email, event, or ticket ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Event
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Phone
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Ticket ID
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">
                  Registered
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No participants found
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => {
                  const initials = reg.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <tr
                      key={reg.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-(--sidebar-primary)/10 text-xs font-semibold text-sidebar-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{reg.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {reg.userEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {reg.eventName}
                        </p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {reg.userPhone ?? "—"}
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        {reg.ticketId ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-emerald-200/60 bg-emerald-50 font-mono text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-400"
                            >
                              {reg.ticketId}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No ticket
                          </span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell text-muted-foreground">
                        {reg.quantity}
                      </td>
                      <td className="px-4 py-3">
                        {reg.status === "cancelled" ? (
                          <Badge variant="destructive">Cancelled</Badge>
                        ) : reg.status === "confirmed" ? (
                          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Confirmed</Badge>
                        ) : (
                          <Badge variant="secondary" className="capitalize">{reg.status}</Badge>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground xl:table-cell">
                        {new Date(reg.registrationDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <DeleteRegistrationDialog reg={reg} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
