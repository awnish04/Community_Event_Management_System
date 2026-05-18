import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex items-stretch w-full", className)}
        {...props}
      />
    )
  }
)
InputGroup.displayName = "InputGroup"

export interface InputGroupInputProps extends React.ComponentPropsWithoutRef<typeof Input> {}

export const InputGroupInput = React.forwardRef<React.ElementRef<typeof Input>, InputGroupInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn("pr-10 w-full", className)}
        {...props}
      />
    )
  }
)
InputGroupInput.displayName = "InputGroupInput"

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end"
}

export const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-end", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-y-0 flex items-center z-10",
          align === "inline-end" ? "right-0 pr-1.5" : "left-0 pl-1.5",
          className
        )}
        {...props}
      />
    )
  }
)
InputGroupAddon.displayName = "InputGroupAddon"

export interface InputGroupButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {}

export const InputGroupButton = React.forwardRef<React.ElementRef<typeof Button>, InputGroupButtonProps>(
  ({ className, size = "sm", variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size === "icon-xs" ? "icon" : size}
        className={cn(
          "h-7 w-7 p-0 text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
InputGroupButton.displayName = "InputGroupButton"
