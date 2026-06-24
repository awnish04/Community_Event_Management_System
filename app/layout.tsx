// app/layout.tsx
import "./globals.css"
import { AuthProvider } from "@/lib/context/AuthContext"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
          <AuthProvider>
            <TooltipProvider>
              <main className="flex w-full flex-1 flex-col">{children}</main>
              <Toaster position="top-center" richColors closeButton={false} />
            </TooltipProvider>
          </AuthProvider>
      </body>
    </html>
  )
}
