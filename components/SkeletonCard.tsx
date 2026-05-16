"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        {/* Badge */}
        <Skeleton className="h-5 w-16" />
        {/* Title */}
        <Skeleton className="mt-2 h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* Date */}
        <Skeleton className="h-3.5 w-2/3" />
        {/* Venue */}
        <Skeleton className="h-3.5 w-1/2" />
        {/* Description */}
        <Skeleton className="mt-1 h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </CardContent>

      <CardFooter>
        <Skeleton className="h-3.5 w-20" />
      </CardFooter>
    </Card>
  )
}
