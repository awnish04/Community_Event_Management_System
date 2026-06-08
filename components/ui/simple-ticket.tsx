import * as React from "react"

export interface SimpleTicketProps {
  ticketId: string
  eventName: string
  eventDate: string
  eventTime: string
  venueName: string
  attendeeName: string
  attendeeEmail: string
  qrCode?: string
}

export const SimpleTicket = React.forwardRef<HTMLDivElement, SimpleTicketProps>(
  (
    {
      ticketId,
      eventName,
      eventDate,
      eventTime,
      venueName,
      attendeeName,
      attendeeEmail,
      qrCode,
    },
    ref
  ) => {
    const dateFormatted = new Date(eventDate).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })

    return (
      <div
        ref={ref}
        style={{
          width: "400px",
          padding: "24px",
          backgroundColor: "#ffffff",
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            {eventName}
          </h2>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "4px",
            }}
          >
            CONFIRMED
          </div>
        </div>

        {/* Event Details */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              DATE & TIME
            </div>
            <div style={{ fontSize: "14px", color: "#111827" }}>
              {dateFormatted} at {eventTime}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
                fontWeight: "600",
                marginBottom: "4px",
              }}
            >
              VENUE
            </div>
            <div style={{ fontSize: "14px", color: "#111827" }}>
              {venueName}
            </div>
          </div>
        </div>

        {/* Attendee & QR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                ATTENDEE
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#111827",
                  fontWeight: "600",
                }}
              >
                {attendeeName}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                {attendeeEmail}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                TICKET ID
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#111827",
                  fontFamily: "monospace",
                  fontWeight: "600",
                }}
              >
                {ticketId}
              </div>
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div
              style={{
                padding: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            >
              <img
                src={qrCode}
                alt="QR Code"
                style={{
                  width: "100px",
                  height: "100px",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            fontSize: "12px",
            color: "#9ca3af",
          }}
        >
          Community Event Management
        </div>
      </div>
    )
  }
)
SimpleTicket.displayName = "SimpleTicket"
