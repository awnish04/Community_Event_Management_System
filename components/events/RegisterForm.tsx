"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { registerForEvent } from "@/app/actions/registrations"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, AlertCircle, Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/context/AuthContext"

interface Props {
  eventId: number
  availableSpots: number
  capacity: number
  currentRegistrations: number
  isFull: boolean
  onSuccess?: () => void
}

export function RegisterForm({
  eventId,
  availableSpots,
  capacity,
  currentRegistrations,
  isFull,
  onSuccess,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()

  const maxQty = Math.min(availableSpots, 5)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set("quantity", String(quantity))

    startTransition(async () => {
      const res = await registerForEvent(eventId, formData)
      setResult(res)
      if (res.success) {
        toast.success(res.message || "Successfully registered!")
        setShowForm(false)
        router.refresh()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(res.error || "Registration failed.")
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
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Registered</span>
          <span className="font-medium">{currentRegistrations}</span>
        </div>
      </div>

      <Separator />

      {/* Success state */}
      {result?.success && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{result.message}</p>
        </div>
      )}

      {/* Error state */}
      {result && !result.success && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{result.error}</p>
        </div>
      )}

      {/* Registration flow */}
      {!isFull && !result?.success && (
        <>
          {!user || user.role !== "USER" ? (
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push("/auth/login")}
            >
              Login to Register
            </Button>
          ) : !showForm ? (
            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowForm(true)}
            >
              Register Now
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="name" value={user.name} />
              <input type="hidden" name="email" value={user.email} />

              {/* Quantity counter */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Number of Spots
                </p>
                <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isPending}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3rem] text-center text-lg font-bold tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty || isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Max {maxQty} spot{maxQty !== 1 ? "s" : ""} per registration
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false)
                    setResult(null)
                    setQuantity(1)
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending
                    ? "Registering..."
                    : `Confirm ${quantity > 1 ? `(${quantity} spots)` : ""}`}
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

      {!isFull && !showForm && !result?.success && (!user || user.role !== "USER") && (
        <p className="text-center text-xs text-muted-foreground">
          You must be logged in to register
        </p>
      )}
    </div>
  )
}
