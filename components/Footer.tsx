"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">
            eventspark
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-center text-sm text-muted-foreground md:text-right">
          © 2026 eventspark. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
