"use client"

import Link from "next/link"
import { useState, useEffect, useTransition, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Calendar, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/context/AuthContext"
import { UserMenu } from "@/components/user-menu"

const NAV_LINKS: { label: string; href: string }[] = []

// Stable subscribe/getSnapshot for useSyncExternalStore
const subscribe = () => () => {}
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot
  )
}

function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="flex size-9 items-center justify-center border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <motion.line
          x1="2"
          y1="5"
          x2="16"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.line
          x1="2"
          y1="9"
          x2="16"
          y2="9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.2 }}
        />
        <motion.line
          x1="2"
          y1="13"
          x2="16"
          y2="13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
    </button>
  )
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const pathname = usePathname() || "/"
  const { theme, setTheme } = useTheme()
  const [, startTransition] = useTransition()
  const { isAuthenticated, user } = useAuth()
  const isClient = useIsClient()

  // isClient is false on the server (and first render), true on the client.
  // This prevents hydration mismatch caused by auth state from localStorage.

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false) // md breakpoint
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    startTransition(() => setMenuOpen(false))
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-18 transition-[background-color,border-color,backdrop-filter] duration-300 ease-in-out",
          scrolled || menuOpen
            ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-page grid h-full grid-cols-2 items-center lg:grid-cols-3">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              aria-label="eventspark home"
              className="flex shrink-0 items-center space-x-2"
            >
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">eventspark</span>
            </Link>
          </div>

          {/* Desktop nav — centered, md only */}
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`)
              const isHov = hovered === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className="relative px-4 py-2 text-sm font-medium"
                >
                  {(isHov || (isActive && !hovered)) && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-4xl",
                        isActive ? "bg-primary/10" : "bg-muted"
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-100",
                      isActive
                        ? "font-semibold text-primary"
                        : isHov
                          ? "text-foreground"
                          : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center justify-end gap-2">
            {/* Desktop only: theme toggle + auth */}
            <div className="hidden items-center gap-3 md:flex">
              <AnimatedThemeToggler
                variant="circle"
                className="flex items-center justify-center rounded-full border border-border bg-muted p-2 text-foreground transition-colors hover:bg-muted/80 [&_svg]:size-4"
              />
              <div className="flex items-center gap-2">
                {isClient && isAuthenticated && user?.role === "USER" ? (
                  <UserMenu variant="avatar" />
                ) : !isClient || !isAuthenticated || user?.role !== "USER" ? (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="lg" className="gap-2">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="shadow-lg shadow-primary/20">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : null}
              </div>
            </div>

            {/* Mobile: hamburger only */}
            <MenuToggle
              open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />

            <motion.div
              className="relative z-10 flex h-full flex-col pt-20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <nav className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
                {/* Nav links */}
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      delay: 0.06 + i * 0.08,
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="w-full max-w-xs"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex w-full items-center justify-center px-6 py-4 text-2xl font-bold transition-colors",
                        pathname === link.href ||
                          pathname.startsWith(`${link.href}/`)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Auth + theme section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.06 + NAV_LINKS.length * 0.08,
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="mt-4 flex w-full max-w-xs flex-col gap-2 border-t border-border pt-4"
                >
                  {/* Inline theme switcher — Sun / Moon pill */}
                  <div className="mx-1 mt-1 mb-4 flex items-center gap-1 border border-border bg-muted p-1">
                    <button
                      onClick={() => setTheme("light")}
                      aria-label="Light mode"
                      className={cn(
                        "flex flex-1 items-center justify-center py-2 transition-colors",
                        theme === "light"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Sun className="size-4" aria-hidden />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      aria-label="Dark mode"
                      className={cn(
                        "flex flex-1 items-center justify-center py-2 transition-colors",
                        theme === "dark"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Moon className="size-4" aria-hidden />
                    </button>
                  </div>

                  {isClient && isAuthenticated && user?.role === "USER" ? (
                    <div className="w-full">
                      <UserMenu variant="card" />
                    </div>
                  ) : !isClient || !isAuthenticated || user?.role !== "USER" ? (
                    <>
                      <Link
                        href="/auth/login"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="h-12 w-full text-base"
                        >
                          Log in
                        </Button>
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Button className="h-12 w-full text-base shadow-lg shadow-primary/20">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : null}
                </motion.div>
              </nav>

              {/* Bottom logo watermark */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center pb-10"
              >
                <div className="flex items-center space-x-2 opacity-20 grayscale select-none">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xl font-bold">eventspark</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
