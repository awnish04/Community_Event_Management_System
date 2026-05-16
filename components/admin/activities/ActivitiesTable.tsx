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
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { createActivity } from "@/app/actions/activities"

interface Activity {
  id: number
  name: string
  description: string | null
  type: string | null
  createdAt: Date
}

const ACTIVITY_TYPES = [
  { value: "workshop", label: "Workshop" },
  { value: "talk", label: "Talk" },
  { value: "networking", label: "Networking" },
  { value: "game", label: "Game" },
  { value: "panel", label: "Panel" },
  { value: "other", label: "Other" },
]

const typeColors: Record<string, string> = {
  workshop: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  talk: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  networking: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  game: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  panel: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  other: "bg-muted text-muted-foreground",
}

function CreateActivityDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<string | null>("")

  function handleOpenChange(val: boolean) {
    if (!isPending) {
      setOpen(val)
      if (!val) {
        setError(null)
        setType("")
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (type) formData.set("type", type)

    startTransition(async () => {
      try {
        await createActivity(formData)
        setOpen(false)
        router.refresh()
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription>
            Create a new activity type to associate with events.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ac-name">Activity Name *</Label>
            <Input
              id="ac-name"
              name="name"
              placeholder="e.g. React Workshop"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ac-type">
              Type{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Select
              value={type || ""}
              onValueChange={(value) => setType(value)}
            >
              <SelectTrigger id="ac-type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ac-description">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="ac-description"
              name="description"
              placeholder="Brief description of this activity..."
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
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? "Saving..." : "Add Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ActivitiesTable({ activities }: { activities: Activity[] }) {
  const [search, setSearch] = useState("")

  const filtered = activities.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.type ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Activities</CardTitle>
          <CardDescription>
            {activities.length} activities configured
          </CardDescription>
        </div>
        <CardAction>
          <CreateActivityDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Activity
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
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
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {activities.length === 0
                      ? 'No activities yet. Click "Add Activity" to create one.'
                      : "No activities match your search."}
                  </td>
                </tr>
              ) : (
                filtered.map((activity) => {
                  const colorClass =
                    typeColors[activity.type ?? "other"] ?? typeColors.other
                  return (
                    <tr
                      key={activity.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">{activity.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colorClass}`}
                        >
                          {activity.type ?? "other"}
                        </span>
                      </td>
                      <td className="line-clamp-1 hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {activity.description ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
