// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Spinner } from "@/components/ui/spinner"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import Link from "next/link"
// import { Calendar, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react"
// import { useAuth } from "@/lib/context/AuthContext"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const { login } = useAuth()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setLoading(true)

//     try {
//       if (!email || !password) {
//         setError("Please fill in all fields")
//         setLoading(false)
//         return
//       }
//       await login(email, password, "USER")
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Login failed")
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="mb-8">

//           <div className="text-center">
//             <Link
//               href="/"
//               className="mb-6 inline-flex items-center justify-center space-x-2"
//             >
//               <Calendar className="h-8 w-8" />
//               <span className="text-2xl font-bold">EventHub</span>
//             </Link>
//             <h1 className="text-3xl font-bold">Welcome Back</h1>
//             <p className="mt-2 text-muted-foreground">
//               Sign in to your account to continue
//             </p>
//           </div>
//         </div>

//         {/* Card */}
//         <Card className="border shadow-lg">
//           <CardHeader className="space-y-1">
//             <CardTitle>Login</CardTitle>
//             <CardDescription>
//               Only registered users can login here
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={loading}
//                   required
//                   className="h-11"
//                 />
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password">Password</Label>
//                   <Link
//                     href="/auth/forgot-password"
//                     className="text-xs text-primary hover:underline"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={loading}
//                     required
//                     className="h-11 pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                     className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 className="h-11 w-full text-base font-semibold"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <div className="flex items-center gap-2">
//                     <Spinner />
//                     <span>Signing in...</span>
//                   </div>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 border-t pt-4">
//             <p className="text-center text-sm text-muted-foreground">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/auth/register"
//                 className="font-semibold text-primary hover:underline"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>

//         {/* Footer */}
//         <div className="mt-6 text-center text-xs text-muted-foreground">
//           <p>
//             By continuing, you agree to our{" "}
//             <Link href="/terms" className="underline hover:text-foreground">
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link href="/privacy" className="underline hover:text-foreground">
//               Privacy Policy
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }
      await login(email, password, "USER")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Decorative blurred blobs — mirrors eventspark auth page */}
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
        {/* Header / branding */}
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
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
          {/* Tab switcher */}
          <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1">
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-11 rounded-full border-input px-4"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11 rounded-full border-input px-4 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
                  <span>Signing in…</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Social placeholder — wire up OAuth as needed */}
          <Button
            variant="outline"
            type="button"
            className="h-11 w-full rounded-full border-input text-sm font-medium hover:bg-muted"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

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