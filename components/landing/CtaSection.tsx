"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"

export function CtaSection({ titleWeight }: { titleWeight: number }) {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const buttonHref =
    mounted && isAuthenticated ? "/user/dashboard" : "/auth/register"
  return (
    <section className="relative overflow-hidden pt-10 pb-12 lg:pt-16 lg:pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative pt-20 lg:pt-24">
            <div
              className="pointer-events-none absolute inset-x-0 top-12 z-20 flex justify-center"
              aria-hidden="true"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              >
                <Calendar className="h-20 w-20 text-primary" />
              </motion.div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border bg-card px-6 pt-24 pb-20 shadow-2xl lg:px-10 lg:pt-28 lg:pb-24">
              <div
                className="pointer-events-none absolute inset-x-0 top-5 flex justify-center"
                aria-hidden="true"
              >
                {[
                  {
                    x: -110,
                    y: 20,
                    size: 14,
                    color: "hsl(2 100% 70%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: -72,
                    y: 42,
                    size: 10,
                    color: "hsl(48 100% 62%)",
                    shape: "square",
                    rot: 35,
                  },
                  {
                    x: -38,
                    y: 12,
                    size: 16,
                    color: "hsl(122 48% 61%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: -18,
                    y: 48,
                    size: 8,
                    color: "hsl(217 90% 63%)",
                    shape: "square",
                    rot: -20,
                  },
                  {
                    x: 0,
                    y: 10,
                    size: 12,
                    color: "hsl(319 84% 69%)",
                    shape: "triangle",
                    rot: 15,
                  },
                  {
                    x: 22,
                    y: 46,
                    size: 10,
                    color: "hsl(31 100% 63%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: 56,
                    y: 14,
                    size: 14,
                    color: "hsl(48 100% 62%)",
                    shape: "square",
                    rot: 50,
                  },
                  {
                    x: 78,
                    y: 38,
                    size: 8,
                    color: "hsl(2 100% 70%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: 104,
                    y: 20,
                    size: 12,
                    color: "hsl(122 48% 61%)",
                    shape: "triangle",
                    rot: -30,
                  },
                  {
                    x: -132,
                    y: 54,
                    size: 6,
                    color: "hsl(217 90% 63%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: 126,
                    y: 48,
                    size: 10,
                    color: "hsl(319 84% 69%)",
                    shape: "square",
                    rot: 22,
                  },
                  {
                    x: -146,
                    y: 28,
                    size: 8,
                    color: "hsl(31 100% 63%)",
                    shape: "triangle",
                    rot: 40,
                  },
                  {
                    x: 146,
                    y: 24,
                    size: 12,
                    color: "hsl(48 100% 62%)",
                    shape: "circle",
                    rot: 0,
                  },
                  {
                    x: -54,
                    y: 58,
                    size: 6,
                    color: "hsl(122 48% 61%)",
                    shape: "square",
                    rot: -45,
                  },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `calc(50% + ${p.x}px)`, top: p.y }}
                    initial={{ opacity: 0, scale: 0, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotate: p.rot }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + i * 0.04,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 250,
                      damping: 15,
                    }}
                  >
                    {p.shape === "circle" && (
                      <div
                        style={{
                          width: p.size,
                          height: p.size,
                          borderRadius: "50%",
                          backgroundColor: p.color,
                        }}
                      />
                    )}
                    {p.shape === "square" && (
                      <div
                        style={{
                          width: p.size,
                          height: p.size,
                          borderRadius: 2,
                          backgroundColor: p.color,
                        }}
                      />
                    )}
                    {p.shape === "triangle" && (
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: `${p.size / 2}px solid transparent`,
                          borderRight: `${p.size / 2}px solid transparent`,
                          borderBottom: `${p.size}px solid ${p.color}`,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2
                    className="font-display mb-4 text-3xl tracking-[-0.02em] sm:text-4xl"
                    style={{ fontWeight: titleWeight }}
                  >
                    Your next favourite event is out there.
                  </h2>
                  <p className="mx-auto mb-8 max-w-lg text-lg text-balance">
                    Stop scrolling and start showing up. Find something worth
                    your time and register for free in seconds.
                  </p>
                  <Link href={buttonHref}>
                    <Button
                      size="lg"
                      className="h-12 bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
                    >
                      Find an event <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
