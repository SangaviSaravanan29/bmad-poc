import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      
      if (error) {
        setError(error)
      } else {
        setSuccess(true)
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
              <Sparkles className="h-4 w-4" />
              <span>Get started in minutes</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">
              Build your workflow with <span className="text-white">TaskFlow</span>
            </h1>
            <p className="mt-3 max-w-md text-white/70">
              Create an account to unlock your dashboard and start tracking tasks immediately.
            </p>
            <div className="mt-8 grid max-w-md gap-3 text-sm text-white/70">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-medium text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Email verification</span>
                </div>
                <div className="mt-1">We send a link to confirm your address.</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 font-medium text-white">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Secure sessions</span>
                </div>
                <div className="mt-1">Stay signed in, log out anytime.</div>
              </div>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-md border-white/10 bg-white/5 text-white shadow-xl backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription className="text-white/70">
                Start your TaskFlow journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <div>
                      <div className="font-medium text-white">Check your email</div>
                      <p className="mt-1 text-sm text-white/70">
                        We sent a verification link. Click it to confirm your account.
                      </p>
                      <div className="mt-4">
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => router.push('/login')}
                        >
                          Go to sign in
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/40"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/40"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white/90">
                      Confirm password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/40"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-slate-900 hover:bg-white/90"
                  >
                    {isLoading ? 'Creating…' : 'Create account'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="text-white/80 underline-offset-4 hover:text-white hover:underline"
                    >
                      Already have an account?
                    </button>
                    <div className="text-white/50">Sign in</div>
                  </div>

                  <p className="text-center text-xs text-white/60">
                    By creating an account you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
