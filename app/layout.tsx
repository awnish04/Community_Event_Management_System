import { Geist_Mono, Roboto, Oxanium } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/context/AuthContext"
import { cn } from "@/lib/utils"

const oxanium = Oxanium({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Community Event Management System",
  description: "Discover, create, and manage amazing community events",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
              "h-full font-sans antialiased",
              fontMono.variable
            , "font-sans", oxanium.variable)}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <main className="flex w-full flex-1 flex-col">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
