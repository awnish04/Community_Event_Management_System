import { CheckCircle2, Ticket as TicketIcon, Calendar, User, Hash, Users } from "lucide-react"

export default function VerifyTicketPage({
  searchParams,
}: {
  searchParams: { ticket?: string; event?: string; name?: string; qty?: string }
}) {
  const { ticket, event, name, qty } = searchParams

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Ticket Link</h1>
          <p className="text-muted-foreground mt-2">No ticket information found in the URL.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-zinc-950 border">
        {/* Header */}
        <div className="bg-emerald-500 p-6 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Ticket Verified</h1>
          <p className="mt-1 text-emerald-100 opacity-90">Valid for Entry</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event
            </p>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-primary" />
              <p className="text-lg font-bold text-foreground leading-tight">{event || "Unknown Event"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attendee
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <p className="font-medium text-foreground">{name || "Unknown"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admit
              </p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="font-medium text-foreground">{qty || "1"} Person(s)</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ticket ID
            </p>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-primary" />
              <p className="font-mono text-sm font-bold text-foreground">{ticket}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
