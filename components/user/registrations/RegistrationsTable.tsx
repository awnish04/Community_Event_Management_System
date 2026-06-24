"use client"

import { useState, useTransition, useEffect } from "react"
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
import { Search, Trash2, Loader2, Eye, Ticket } from "lucide-react"
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
import { EventTicketPdf } from "@/components/ui/event-ticket-pdf"

interface Registration {
  id: string
  eventName: string
  eventStatus?: string
  status: string
  quantity?: number
  attendeeName?: string
  attendeeEmail?: string
  registrationDate: string
  ticketId?: string
  qrCode?: string
  event: {
    eventDate: string
    eventTime: string
    venue: {
      name: string
    }
  }
}

// ── Generate PDF and open in new tab ─────────────────────────────────────────
async function openTicketPdfInNewTab(reg: Registration) {
  const domtoimage = (await import("dom-to-image-more")).default
  const { jsPDF } = await import("jspdf")
  const { createRoot } = await import("react-dom/client")

  // Wait for all fonts to be loaded first
  await document.fonts.ready
  await Promise.all([
    document.fonts.load('700 16px "Bricolage Grotesque"'),
    document.fonts.load('800 16px "Bricolage Grotesque"'),
    document.fonts.load('600 16px "DM Sans"'),
    document.fonts.load('700 16px "DM Sans"'),
  ]).catch(() => {
    // Fonts already loaded or failed, continue anyway
  })

  const TICKET_W = 900
  const TICKET_H = 340
  const SCALE = 3

  // ── Off-screen container ──
  const container = document.createElement("div")
  container.id = "ticket-capture"
  container.style.cssText = `
    position: absolute;
    left: -99999px;
    top: 0;
    width: ${TICKET_W}px;
    height: ${TICKET_H}px;
    overflow: visible;
  `

  // ── Scoped CSS reset: kills ALL Tailwind/browser border artifacts ──
  const resetStyle = document.createElement("style")
  resetStyle.textContent = `
    #ticket-capture,
    #ticket-capture *,
    #ticket-capture *::before,
    #ticket-capture *::after {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      text-decoration: none !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    #ticket-capture [data-b="outer"] {
      border: 1.5px solid #e5e7eb !important;
      box-shadow: 0 8px 40px rgba(0,0,0,0.10) !important;
    }
    #ticket-capture [data-b="pill"] {
      border: 1px solid #e5e7eb !important;
    }
    #ticket-capture [data-b="qr"] {
      border: 1px solid #e5e7eb !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
    }
    #ticket-capture [data-b="nodash"] {
      border: 2px dashed #e5e7eb !important;
    }
  `

  document.head.appendChild(resetStyle)
  document.body.appendChild(container)

  const root = createRoot(container)

  await new Promise<void>((resolve) => {
    root.render(
      <EventTicketPdf
        ticketId={reg.ticketId!}
        eventName={reg.eventName}
        eventDate={reg.event.eventDate}
        eventTime={reg.event.eventTime}
        venueName={reg.event.venue.name}
        attendeeName={reg.attendeeName ?? "Guest"}
        attendeeEmail={reg.attendeeEmail ?? ""}
        qrCode={reg.qrCode}
      />
    )
    // Wait for React + fonts to fully load and paint
    setTimeout(resolve, 1000)
  })

  const ticketEl = container.firstChild as HTMLElement

  try {
    // Capture at 3× scale for sharp PDF text
    const dataUrl = await domtoimage.toPng(ticketEl, {
      width: TICKET_W * SCALE,
      height: TICKET_H * SCALE,
      style: {
        transform: `scale(${SCALE})`,
        transformOrigin: "top left",
        width: `${TICKET_W}px`,
        height: `${TICKET_H}px`,
      },
    })

    // 1px = 0.2646mm at 96 DPI
    const wMm = TICKET_W * 0.2646
    const hMm = TICKET_H * 0.2646

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [wMm, hMm],
    })

    pdf.addImage(dataUrl, "PNG", 0, 0, wMm, hMm, undefined, "FAST")

    const blob = pdf.output("blob")
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")

    // Revoke after 60s to allow the new tab to load
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } finally {
    root.unmount()
    document.body.removeChild(container)
    document.head.removeChild(resetStyle)
  }
}

// ── View Ticket Button ────────────────────────────────────────────────────────
function ViewTicketButton({ reg }: { reg: Registration }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleView = async () => {
    setIsGenerating(true)
    try {
      await openTicketPdfInNewTab(reg)
    } catch (err) {
      console.error("Failed to generate ticket PDF:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!reg.ticketId) return null

  if (reg.eventStatus === "cancelled") {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Button variant="ghost" size="icon-sm" disabled className="opacity-50">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <TooltipContent>Event Cancelled</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleView}
            disabled={isGenerating}
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 dark:hover:bg-blue-950/20"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>
        }
      />
      <TooltipContent>View Ticket PDF</TooltipContent>
    </Tooltip>
  )
}

// ── Cancel Registration Dialog ────────────────────────────────────────────────
function CancelRegistrationDialog({ reg }: { reg: Registration }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [canCancel, setCanCancel] = useState(true)

  useEffect(() => {
    const regTime = new Date(reg.registrationDate).getTime()
    const diffHours = (Date.now() - regTime) / (1000 * 60 * 60)
    setCanCancel(diffHours <= 12)
  }, [reg.registrationDate])

  function handleCancel() {
    if (!canCancel) return
    startTransition(async () => {
      try {
        await deleteRegistration(parseInt(reg.id, 10))
        setOpen(false)
        router.refresh()
      } catch (err) {
        console.error("Cancel registration failed:", err)
      }
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
                  disabled={!canCancel}
                  className={
                    "text-destructive hover:bg-destructive/10 hover:text-destructive " +
                    (!canCancel ? "opacity-50 cursor-not-allowed" : "")
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{canCancel ? "Cancel Registration" : "Cannot cancel after 12 hours"}</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Registration</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your registration for{" "}
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
            Keep Registration
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {isPending ? "Cancelling…" : "Cancel Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Table ────────────────────────────────────────────────────────────────
export function RegistrationsTable({
  registrations,
}: {
  registrations: Registration[]
}) {
  const [search, setSearch] = useState("")

  const filtered = registrations.filter(
    (r) =>
      r.eventName.toLowerCase().includes(search.toLowerCase()) ||
      (r.ticketId && r.ticketId.toLowerCase().includes(search.toLowerCase())) ||
      r.event.venue.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>My Registrations</CardTitle>
          <CardDescription>
            {registrations.length} event
            {registrations.length !== 1 ? "s" : ""} registered
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by event, ticket ID, or venue…"
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
                  Event
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Venue
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Time
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Qty
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Ticket ID
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
                    No registrations found
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr
                    key={reg.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{reg.eventName}</p>
                        <p className="text-xs text-muted-foreground md:hidden mt-0.5">
                          {reg.event.venue.name}
                        </p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {reg.event.venue.name}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                      {new Date(reg.event.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                      {reg.event.eventTime}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {reg.quantity ?? 1}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {reg.ticketId ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-200/60 bg-emerald-50 font-mono text-xs text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/20 dark:text-emerald-400"
                        >
                          <Ticket className="mr-1 h-3 w-3" />
                          {reg.ticketId}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No ticket
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {reg.eventStatus === "cancelled" ? (
                        <Badge variant="destructive">Event Cancelled</Badge>
                      ) : reg.status === "CONFIRMED" ? (
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Confirmed</Badge>
                      ) : (
                        <Badge variant="secondary" className="capitalize">{reg.status.toLowerCase()}</Badge>
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
                        {reg.ticketId && <ViewTicketButton reg={reg} />}
                        <CancelRegistrationDialog reg={reg} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
