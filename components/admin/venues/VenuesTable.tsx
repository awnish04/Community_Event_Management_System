"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Loader2,
} from "lucide-react"
import { createVenue, editVenue, deleteVenue } from "@/app/actions/events"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Venue {
  id: number
  name: string
  address: string
  capacity: number
  description: string | null
  createdAt: Date
}

function CreateVenueDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await createVenue(formData)
        setOpen(false)
        router.refresh()
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Venue
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogDescription>
            Register a new venue to use for community events.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="vn-name">Venue Name *</Label>
            <Input
              id="vn-name"
              name="name"
              placeholder="e.g. City Convention Center"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-address">Address *</Label>
            <Input
              id="vn-address"
              name="address"
              placeholder="e.g. 123 Main Street, Kathmandu"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-capacity">Capacity *</Label>
            <Input
              id="vn-capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g. 200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vn-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="vn-description"
              name="description"
              placeholder="Any additional details about the venue..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <MapPin className="size-4" />
              )}
              {isPending ? "Saving..." : "Add Venue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditVenueDialog({ venue }: { venue: Venue }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await editVenue(venue.id, formData)
        setOpen(false)
        router.refresh()
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Edit Venue</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
          <DialogDescription>
            Update the details for this venue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`vn-name-${venue.id}`}>Venue Name *</Label>
            <Input
              id={`vn-name-${venue.id}`}
              name="name"
              defaultValue={venue.name}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`vn-address-${venue.id}`}>Address *</Label>
            <Input
              id={`vn-address-${venue.id}`}
              name="address"
              defaultValue={venue.address}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`vn-capacity-${venue.id}`}>Capacity *</Label>
            <Input
              id={`vn-capacity-${venue.id}`}
              name="capacity"
              type="number"
              min="1"
              defaultValue={venue.capacity}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`vn-description-${venue.id}`}>
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id={`vn-description-${venue.id}`}
              name="description"
              defaultValue={venue.description || ""}
              rows={3}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteVenueDialog({ venue }: { venue: Venue }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteVenue(venue.id)
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
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Delete Venue</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Venue</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{venue.name}</strong>? This
            action cannot be undone.
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

export function VenuesTable({ venues }: { venues: Venue[] }) {
  const [search, setSearch] = useState("")

  const filtered = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Venues</CardTitle>
          <CardDescription>{venues.length} venues available</CardDescription>
        </div>
        <CardAction>
          <CreateVenueDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
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
                  Venue
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                  Address
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Capacity
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                  Description
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
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {venues.length === 0
                      ? 'No venues yet. Click "Add Venue" to create one.'
                      : "No venues match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((venue) => (
                  <tr
                    key={venue.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">{venue.name}</td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {venue.address}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span className="font-medium text-foreground">
                          {venue.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {venue.description ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <EditVenueDialog venue={venue} />
                        <DeleteVenueDialog venue={venue} />
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
