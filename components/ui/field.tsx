import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
  }
)
Field.displayName = "Field"

export interface FieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

export const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn("text-xs font-medium text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
FieldLabel.displayName = "FieldLabel"
