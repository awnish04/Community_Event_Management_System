"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { registerForEvent } from "@/app/actions/registrations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface Props {
  eventId: number
  availableSpots: number
  capacity: number
  currentRegistrations: number
  occupancyPercentage: number
  isFull: boolean
}

export function RegisterForm({
  eventId,
  availableSpots,
  capacity,
  currentRegistrations,
  occupancyPercentage,
  isFull,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res = await registerForEvent(eventId, formData)
      setResult(res)
      if (res.success) {
        setShowForm(false)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price</span>
          <span className="font-medium">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Available Spots</span>
          <span className="font-medium">{availableSpots}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Capacity</span>
          <span className="font-medium">{capacity}</span>
        </div>
      </div>

      <Separator />

      {/* Capacity bar */}
      <div>
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>{currentRegistrations} registered</span>
          <span>{occupancyPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          />
        </div>
      </div>

      <Separator />

      {/* Success state */}
      {result?.success && (
        <div className="flex items-start gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{result.message}</p>
        </div>
      )}

      {/* Error state */}
      {result && !result.success && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{result.error}</p>
        </div>
      )}

      {/* Registration form */}
      {!isFull && !result?.success && (
        <>
          {!showForm ? (
            <Button className="w-full" size="lg" onClick={() => setShowForm(true)}>
              Register Now
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Your Name *</Label>
                <Input
                  id="reg-name"
                  name="name"
                  placeholder="e.g. John Doe"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">
                  Phone{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setResult(null)
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={isPending}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Registering..." : "Confirm"}
                </Button>
              </div>
            </form>
          )}
        </>
      )}

      {isFull && (
        <Button className="w-full" size="lg" disabled>
          Event Full
        </Button>
      )}

      {!isFull && !showForm && !result?.success && (
        <p className="text-center text-xs text-muted-foreground">
          No account needed — just your name and email
        </p>
      )}
    </div>
  )
}
