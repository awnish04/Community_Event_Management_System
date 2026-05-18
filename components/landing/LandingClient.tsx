"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./HeroSection"
import { EventsSection } from "./EventsSection"
import { FeaturesSection } from "./FeaturesSection"
import { SocialProofSection } from "./SocialProofSection"
import { CtaSection } from "./CtaSection"
import { Footer } from "@/components/Footer"

type DatabaseEvent = {
  id: number
  name: string
  description: string | null
  eventDate: string
  eventTime: string | null
  venue: {
    name: string
    address?: string
  }
}

export function LandingClient({
  initialEvents,
}: {
  initialEvents: DatabaseEvent[]
}) {
  const [devOpen, setDevOpen] = useState(false)
  const [titleWeight, setTitleWeight] = useState(700)
  const [confettiSize, setConfettiSize] = useState(2.5)
  const [confettiOpacity, setConfettiOpacity] = useState(0.8)
  const [confettiCount, setConfettiCount] = useState(8)
  const [confettiSpread, setConfettiSpread] = useState(1.0)
  const [bentoStyle, setBentoStyle] = useState(0)

  // Apply title weight globally / dynamically on mount/change
  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6, .font-display")
      .forEach((el) => {
        el.style.fontWeight = String(titleWeight)
      })
  }, [titleWeight])

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      {/* Hero Section */}
      <HeroSection
        titleWeight={titleWeight}
        confettiSize={confettiSize}
        confettiOpacity={confettiOpacity}
        confettiCount={confettiCount}
        confettiSpread={confettiSpread}
      />

      {/* Events Showcase */}
      <EventsSection initialEvents={initialEvents} titleWeight={titleWeight} />

      {/* Bento Features Section */}
      <FeaturesSection titleWeight={titleWeight} bentoStyle={bentoStyle} />

      {/* Organizer Testimonials */}
      <SocialProofSection titleWeight={titleWeight} />

      {/* CTA Section */}
      <CtaSection titleWeight={titleWeight} />

      {/* Standardized beautiful Footer */}
      <Footer />
    </div>
  )
}
