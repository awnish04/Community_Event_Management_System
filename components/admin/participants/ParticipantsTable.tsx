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
import { Search, Trash2, Loader2, Check, X } from "lucide-react"
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
import { approveRegistration, rejectRegistration, deleteRegistration } from "@/app/actions/registrations"

import { cn } from "@/lib/utils"

interface Registration {
  id: number
  status: string
  registrationDate: Date
  userName: string
  userEmail: string
  userPhone: string | null
  eventName: string
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
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
            Are you sure you want to delete the registration of <strong>{reg.userName}</strong> for the event <strong>{reg.eventName}</strong>? This action cannot be undone.
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

export function ParticipantsTable({ registrations }: { registrations: Registration[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  const [activeRegId, setActiveRegId] = useState<number | null>(null)

  const filtered = registrations.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.eventName.toLowerCase().includes(search.toLowerCase())
  )

  function handleApprove(id: number) {
    setActiveRegId(id)
    startTransition(async () => {
      try {
        await approveRegistration(id)
        router.refresh()
      } finally {
        setActiveRegId(null)
      }
    })
  }

  function handleReject(id: number) {
    setActiveRegId(id)
    startTransition(async () => {
      try {
        await rejectRegistration(id)
        router.refresh()
      } finally {
        setActiveRegId(null)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Participants</CardTitle>
          <CardDescription>
            {registrations.length} registrations total
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by participant name, email or event..."
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
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
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

                  const isRegPending = isPending && activeRegId === reg.id

                  return (
                    <tr
                      key={reg.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-[var(--sidebar-primary)]/10 text-xs font-semibold text-[var(--sidebar-primary)]">
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
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize font-semibold px-2.5 py-0.5 rounded-full border shadow-none",
                            reg.status === "confirmed"
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50"
                              : reg.status === "cancelled"
                                ? "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/50"
                                : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50"
                          )}
                        >
                          {reg.status === "confirmed"
                            ? "Approved"
                            : reg.status === "cancelled"
                              ? "Rejected"
                              : reg.status}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
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
                          {isRegPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <>
                              {reg.status !== "confirmed" && (
                                <Tooltip>
                                  <TooltipTrigger
                                    render={
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/20"
                                        onClick={() => handleApprove(reg.id)}
                                        disabled={isPending}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                  <TooltipContent>
                                    Approve Participant
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {reg.status !== "cancelled" && (
                                <Tooltip>
                                  <TooltipTrigger
                                    render={
                                      <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/20"
                                        onClick={() => handleReject(reg.id)}
                                        disabled={isPending}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                  <TooltipContent>
                                    Reject Participant
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              <DeleteRegistrationDialog reg={reg} />
                            </>
                          )}
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
