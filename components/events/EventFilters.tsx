"use client"

import { useRouter, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface Props {
  venues: { id: number; name: string }[]
  activityTypes: string[]
  currentFilters: {
    search: string
    venue: string
    activity: string
    from: string
    to: string
  }
}

export function EventFilters({ venues, activityTypes, currentFilters }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const current = { ...currentFilters, [key]: value }

      if (current.search) params.set("search", current.search)
      if (current.venue && current.venue !== "all")
        params.set("venue", current.venue)
      if (current.activity && current.activity !== "all")
        params.set("activity", current.activity)
      if (current.from) params.set("from", current.from)
      if (current.to) params.set("to", current.to)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [currentFilters, pathname, router]
  )

  const hasFilters =
    currentFilters.search ||
    currentFilters.venue ||
    currentFilters.activity ||
    currentFilters.from ||
    currentFilters.to

  const clearAll = () => {
    startTransition(() => router.push(pathname))
  }

  return (
    <div className="mb-8 space-y-4 border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label className="text-xs font-medium text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              defaultValue={currentFilters.search}
              onChange={(e) => {
                const val = e.target.value
                // Debounce: update on Enter or blur
                e.currentTarget.onkeydown = (ke) => {
                  if (ke.key === "Enter") updateFilter("search", val)
                }
              }}
              onBlur={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>

        {/* Venue */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Venue
          </Label>
          <Select
            value={currentFilters.venue || "all"}
            onValueChange={(v: string | null) =>
              updateFilter("venue", v === "all" || !v ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All venues</SelectItem>
              {venues.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Activity Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Activity Type
          </Label>
          <Select
            value={currentFilters.activity || "all"}
            onValueChange={(v: string | null) =>
              updateFilter("activity", v === "all" || !v ? "" : v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {activityTypes.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            From date
          </Label>
          <Input
            type="date"
            defaultValue={currentFilters.from}
            onChange={(e) => updateFilter("from", e.target.value)}
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div className="flex items-center justify-between border-t pt-3">
          <p className="text-xs text-muted-foreground">
            Filters are active
            {isPending && " · Updating..."}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={clearAll}
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
