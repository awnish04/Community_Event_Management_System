import { Calendar, Clock, MapPin, User, Hash } from "lucide-react"
import * as React from "react"

export interface EventTicketPdfProps {
  ticketId: string
  eventName: string
  eventDate: string
  eventTime: string
  venueName: string
  attendeeName: string
  attendeeEmail: string
  qrCode?: string
}

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
`

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <span style={{ color: "rgba(255,255,255,0.9)", marginTop: "1px" }}>
        {icon}
      </span>

      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1.3,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export const EventTicketPdf = React.forwardRef<
  HTMLDivElement,
  EventTicketPdfProps
>((props, ref) => {
  const {
    ticketId,
    eventName,
    eventDate,
    eventTime,
    venueName,
    attendeeName,
    qrCode,
  } = props

  const date = new Date(eventDate)
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "long" })
  const year = date.getFullYear()

  return (
    <div
      ref={ref}
      style={{
        width: "900px",
        height: "340px",
        display: "flex",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",

        // 🎟️ FESTIVAL DARK BACKGROUND
        backgroundColor: "rgb(20, 10, 30)",
        backgroundImage:
          "linear-gradient(to bottom right, rgba(255,120,0,0.35), rgba(80,0,120,0.45)), url(https://www.transparenttextures.com/patterns/cream-paper.png)",

        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Font */}
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />

      {/* 🎭 WATERMARK */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            position: "absolute",
            top: "-260px",
            left: "-260px",
            width: "700px",
            height: "700px",
            color: "rgba(255,180,100,0.5)",
          }}
        >
          <svg viewBox="0 0 400 400" width="100%" height="100%">
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
            />
            <circle
              cx="200"
              cy="200"
              r="155"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
            />
          </svg>
        </div>

        {/* RIGHT */}
        <div
          style={{
            position: "absolute",
            bottom: "-260px",
            right: "-260px",
            width: "700px",
            height: "700px",
            color: "rgba(120,180,255,0.4)",
          }}
        >
          <svg viewBox="0 0 400 400" width="100%" height="100%">
            <circle
              cx="200"
              cy="200"
              r="180"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
            />
            <circle
              cx="200"
              cy="200"
              r="155"
              fill="none"
              stroke="currentColor"
              strokeWidth="16"
            />
          </svg>
        </div>
      </div>

      {/* LEFT BAR */}
      <div
        style={{
          width: "8px",
          background: "linear-gradient(180deg, #ff7a18, #af002d)",
        }}
      />

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Calendar style={{ width: 16, height: 16, color: "#fff" }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              EventSpark
            </span>
          </div>

          <span
            style={{
              fontSize: 9,
              width: "30%",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            General Admission
          </span>
        </div>

        {/* EVENT NAME */}
        <div>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Event
          </p>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            {eventName}
          </h2>
        </div>

        {/* DETAILS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 52px",
          }}
        >
          <DetailRow
            icon={<Calendar style={{ width: 15, height: 15 }} />}
            label="Date"
            value={`${dayName}, ${day} ${month} ${year}`}
          />
          <DetailRow
            icon={<Clock style={{ width: 15, height: 15 }} />}
            label="Time"
            value={eventTime}
          />
          <DetailRow
            icon={<MapPin style={{ width: 15, height: 15 }} />}
            label="Venue"
            value={venueName}
          />
          <DetailRow
            icon={<User style={{ width: 15, height: 15 }} />}
            label="Attendee"
            value={attendeeName}
          />
        </div>

        {/* TICKET ID */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 6,
          }}
        >
          <Hash style={{ width: 14, height: 14, color: "#fff" }} />

          <span
            style={{
              width: "30%",
              fontSize: 12,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Ticket ID
          </span>

          <span
            style={{
              marginLeft: "auto",
              fontFamily: "monospace",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {ticketId}
          </span>
        </div>
      </div>

      {/* PERFORATION */}
      <div
        style={{
          width: 1,
          margin: "0 4px",
          background:
            "repeating-linear-gradient(to bottom, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 16px)",
        }}
      />

      {/* RIGHT */}
      <div
        style={{
          width: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: 24,
          background: "rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {qrCode ? (
          <div style={{ background: "#fff", padding: 10 }}>
            <img src={qrCode} style={{ width: 140, height: 140 }} alt="QR" />
          </div>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.4)" }}>No QR</div>
        )}

        <p
          style={{
            margin: 0,
            fontSize: "8px",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#9ca3af",
            textAlign: "center",
            width: "100%",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {" "}
          Scan at Entrance{" "}
        </p>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 42, fontWeight: 800, color: "#fff" }}>{day}</p>
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {month.slice(0, 3)} {year}
          </p>
        </div>
      </div>
    </div>
  )
})

EventTicketPdf.displayName = "EventTicketPdf"
