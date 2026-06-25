"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Calendar, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { toast } from "sonner"

type FormErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const { register } = useAuth()
  const router = useRouter()

  const clearFieldError = (field: keyof FormErrors) =>
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))

  const validate = (): boolean => {
    const errors: FormErrors = {}

    if (!name.trim()) {
      errors.name = "Full name is required"
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validate()) return

    setLoading(true)
    try {
      await register(name, email, password)
      toast.success("Account created successfully!", {
        description: "Please log in with your credentials.",
      })
      setTimeout(() => {
        router.push("/auth/login")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
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
        <div className="absolute top-[8%] left-[6%] h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute top-[20%] right-[10%] h-14 w-14 rotate-12 rounded-xl bg-primary/8 blur-xl" />
        <div className="absolute bottom-[15%] left-[12%] h-12 w-12 rounded-full bg-primary/10 blur-xl" />
        <div className="absolute right-[7%] bottom-[25%] h-16 w-16 -rotate-12 rounded-xl bg-primary/6 blur-xl" />
        <div className="absolute top-[48%] left-[3%] h-10 w-10 rounded-full bg-muted-foreground/5 blur-lg" />
        <div className="absolute top-[36%] right-[4%] h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
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
            Create account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join our community and start discovering events
          </p>
        </div>

        {/* Registration card */}
        <Card className="rounded-2xl border border-border shadow-lg">
          <CardHeader className="pb-0">
            {/* Tab switcher */}
            <div className="grid grid-cols-2 rounded-full bg-muted p-1">
              <Link
                href="/auth/login"
                className="flex items-center justify-center rounded-full py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <div className="flex items-center justify-center rounded-full bg-card py-2 text-sm font-medium text-foreground shadow-sm">
                Sign up
              </div>
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
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearFieldError("name")
                    }}
                    disabled={loading}
                    className={`h-11 w-full rounded-full border-input px-4 ${formErrors.name ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  {formErrors.name && (
                    <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

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
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearFieldError("email")
                    }}
                    disabled={loading}
                    className={`h-11 w-full rounded-full border-input px-4 ${formErrors.email ? "border-destructive ring-1 ring-destructive" : ""}`}
                  />
                  {formErrors.email && (
                    <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-3">
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
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearFieldError("password")
                        if (confirmPassword) clearFieldError("confirmPassword")
                      }}
                      disabled={loading}
                      className={`h-11 w-full rounded-full border-input px-4 pr-12 ${formErrors.password ? "border-destructive ring-1 ring-destructive" : ""}`}
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
                  {formErrors.password ? (
                    <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.password}
                    </p>
                  ) : (
                    <p className="pl-1 text-xs text-muted-foreground">
                      Min. 6 characters
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm font-medium text-foreground"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        clearFieldError("confirmPassword")
                      }}
                      disabled={loading}
                      className={`h-11 w-full rounded-full border-input px-4 pr-12 ${formErrors.confirmPassword ? "border-destructive ring-1 ring-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={loading}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword ? (
                    <p className="flex items-center gap-1 pl-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {formErrors.confirmPassword}
                    </p>
                  ) : confirmPassword && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-muted/50 px-3 py-2">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Match
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                          <span className="text-xs text-red-600 dark:text-red-400">
                            No match
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-foreground text-sm font-medium text-background hover:bg-foreground/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    <span>Creating account…</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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
