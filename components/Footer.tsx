"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left — Logo & tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex w-fit items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                EventHub
              </span>
            </Link>
            <p className="text-sm">
              Discover, create, and manage amazing community events. Connect
              with your neighbors and build lasting relationships.
            </p>
          </div>

          {/* Right — Links */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-foreground">
                Navigation
              </h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </nav>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-foreground">Account</h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 EventHub. Built for the community.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
