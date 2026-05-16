import { db } from "@/db"
import { activities, eventActivities } from "@/db/schema"
import { sql } from "drizzle-orm"
import { Zap } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Activities — EventHub",
  description: "Browse all activity types available across community events",
}

const typeColors: Record<string, string> = {
  workshop: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50",
  talk: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50",
  networking: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50",
  game: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50",
  panel: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50",
  other: "bg-muted text-muted-foreground border-border",
}

const typeIcons: Record<string, string> = {
  workshop: "🔧",
  talk: "🎤",
  networking: "🤝",
  game: "🎮",
  panel: "💬",
  other: "✨",
}

async function getActivities() {
  try {
    const allActivities = await db
      .select({
        id: activities.id,
        name: activities.name,
        description: activities.description,
        type: activities.type,
      })
      .from(activities)
      .orderBy(activities.name)

    // Count how many events use each activity
    const usageCounts = await db
      .select({
        activityId: eventActivities.activityId,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(eventActivities)
      .groupBy(eventActivities.activityId)

    const countMap = Object.fromEntries(
      usageCounts.map((r) => [r.activityId, Number(r.count)])
    )

    return allActivities.map((a) => ({
      ...a,
      usageCount: countMap[a.id] ?? 0,
    }))
  } catch {
    return []
  }
}

export default async function ActivitiesPage() {
  const allActivities = await getActivities()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">Activities</h1>
        <p className="text-lg text-muted-foreground">
          Discover the types of activities featured across our community events
        </p>
      </div>

      {allActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Zap className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="mb-2 text-xl font-semibold">No activities yet</h2>
          <p className="text-muted-foreground">
            Activities will appear here once they&apos;ve been added by an admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allActivities.map((activity) => {
            const typeKey = activity.type ?? "other"
            const colorClass = typeColors[typeKey] ?? typeColors.other
            const icon = typeIcons[typeKey] ?? typeIcons.other

            return (
              <Card
                key={activity.id}
                className="flex flex-col transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 text-2xl">{icon}</div>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">
                      {activity.name}
                    </CardTitle>
                    {activity.type && (
                      <span
                        className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${colorClass}`}
                      >
                        {activity.type}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  {activity.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                  <div className="mt-auto">
                    <Badge variant="outline" className="text-xs">
                      Used in {activity.usageCount} event
                      {activity.usageCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
