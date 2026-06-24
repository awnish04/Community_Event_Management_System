"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Calendar, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})
  const { login } = useAuth()

  const validate = () => {
    const errors: { email?: string; password?: string } = {}
    if (!email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      errors.password = "Password is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validate()) {
      return
    }
    
    setLoading(true)

    try {
      await login(email, password, "USER")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Decorative blurred blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[10%] left-[8%] h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute top-[22%] right-[10%] h-14 w-14 rotate-12 rounded-xl bg-primary/8 blur-xl" />
        <div className="absolute bottom-[18%] left-[14%] h-12 w-12 rounded-full bg-primary/10 blur-xl" />
        <div className="absolute right-[7%] bottom-[28%] h-16 w-16 -rotate-12 rounded-xl bg-primary/6 blur-xl" />
        <div className="absolute top-[50%] left-[4%] h-10 w-10 rounded-full bg-muted-foreground/5 blur-lg" />
        <div className="absolute top-[38%] right-[4%] h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute right-[20%] bottom-[10%] h-16 w-16 rounded-full bg-primary/8 blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              EventHub
            </span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Auth card */}
        <Card className="rounded-2xl border border-border shadow-lg">
          <CardHeader className="pb-0">
            {/* Tab switcher */}
            <div className="grid grid-cols-2 rounded-full bg-muted p-1">
              <div className="flex items-center justify-center rounded-full bg-card py-2 text-sm font-medium text-foreground shadow-sm">
                Log in
              </div>
              <Link
                href="/auth/register"
                className="flex items-center justify-center rounded-full py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign up
              </Link>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors(p => ({ ...p, email: undefined })) }}
                  disabled={loading}
                  className={`h-11 rounded-full border-input px-4 ${formErrors.email ? "border-destructive ring-1 ring-destructive" : ""}`}
                />
                {formErrors.email && (
                  <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (formErrors.password) setFormErrors(p => ({ ...p, password: undefined })) }}
                    disabled={loading}
                    className={`h-11 rounded-full border-input px-4 pr-12 ${formErrors.password ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {formErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-foreground text-sm font-medium text-background hover:bg-foreground/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Signing in…</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Not a user?{" "}
              <Link
                href="/auth/admin-login"
                className="font-semibold text-primary hover:underline"
              >
                Admin login
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
