"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { ConfettiLayer } from "./ConfettiLayer"
import { useAuth } from "@/lib/context/AuthContext"

function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const iconClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8 text-primary",
  }
  return (
    <div className="flex items-center space-x-2">
      <Calendar className={iconClasses[size]} />
      <span
        className={`font-bold text-foreground ${size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-xl"}`}
      >
        eventspark
      </span>
    </div>
  )
}

const rotatingWords = [
  "events.",
  "experiences.",
  "communities.",
  "connections.",
]

export function HeroSection({
  titleWeight,
  confettiSize,
  confettiOpacity,
  confettiCount,
  confettiSpread,
}: {
  titleWeight: number
  confettiSize: number
  confettiOpacity: number
  confettiCount: number
  confettiSpread: number
}) {
  const { isAuthenticated } = useAuth()
  const buttonHref = isAuthenticated ? "/user/dashboard" : "/auth/register"
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-20">
        <div className="relative flex min-h-[580px] items-center justify-center">
          {/* Confetti shapes behind cards — dynamic */}
          <ConfettiLayer
            size={confettiSize}
            opacity={confettiOpacity}
            count={confettiCount}
            spread={confettiSpread}
          />

          {/* Top-left card */}
          <motion.div
            className="absolute top-[20px] left-[-100px] hidden w-[200px] md:block lg:left-[-40px] lg:w-[260px]"
            initial={{ opacity: 0, scale: 0.3, x: -80, y: -60 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
          >
            <div className="rotate-[6deg] overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/event-chill-code-workshop.jpg"
                alt="Chill code workshop"
                className="h-[150px] w-full object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Workshop
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom-left card */}
          <motion.div
            className="absolute bottom-[20px] left-[-120px] hidden w-[200px] md:block lg:left-[-60px] lg:w-[260px]"
            initial={{ opacity: 0, scale: 0.3, x: -80, y: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.35,
            }}
          >
            <div className="rotate-[-5deg] overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/event-late-night-jam.jpg"
                alt="Late night jam"
                className="h-[150px] w-full object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Social
                </span>
              </div>
            </div>
          </motion.div>

          {/* Top-right card */}
          <motion.div
            className="absolute top-[20px] right-[-100px] hidden w-[200px] md:block lg:right-[-40px] lg:w-[260px]"
            initial={{ opacity: 0, scale: 0.3, x: 80, y: -60 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.25,
            }}
          >
            <div className="rotate-[-6deg] overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/event-startup-weekend.jpg"
                alt="Startup weekend"
                className="h-[150px] w-full object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Hackathon
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom-right card */}
          <motion.div
            className="absolute right-[-120px] bottom-[20px] hidden w-[200px] md:block lg:right-[-60px] lg:w-[260px]"
            initial={{ opacity: 0, scale: 0.3, x: 80, y: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.4,
            }}
          >
            <div className="rotate-[5deg] overflow-hidden rounded-2xl shadow-lg">
              <img
                src="/assets/event-vibe-coding-summit.jpg"
                alt="Vibe coding summit"
                className="h-[150px] w-full object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Conference
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center — headline */}
          <motion.div
            className="relative z-10 mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center justify-center">
              <Logo size="lg" />
            </div>
            <h1
              className="font-display mb-6 text-4xl leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-[44px] 2xl:text-[56px]"
              style={{ fontWeight: titleWeight }}
            >
              The event platform
              <br />
              where ideas become{" "}
              <span
                className="relative inline-block"
                style={{ minWidth: "7ch" }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35 }}
                    className="inline-block text-foreground"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
                {/* Invisible longest word to reserve space */}
                <span
                  className="invisible block h-0 overflow-hidden"
                  aria-hidden="true"
                >
                  communities.
                </span>
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Discover local events, register in seconds, and never miss
              something worth showing up for. From workshops to community
              meetups your next experience is one click away.
            </p>
            <Link href={buttonHref}>
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Browse events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
