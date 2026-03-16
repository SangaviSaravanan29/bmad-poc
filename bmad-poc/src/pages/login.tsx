import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error)
      } else {
        router.push('/dashboard')
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
        <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
              <Sparkles className="h-4 w-4" />
              <span>Modern auth flow</span>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">
              Welcome back to <span className="text-white">TaskFlow</span>
            </h1>
            <p className="mt-3 max-w-md text-white/70">
              Sign in to manage tasks, track progress, and keep momentum—without the clutter.
            </p>
            <div className="mt-8 grid max-w-md gap-3 text-sm text-white/70">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="font-medium text-white">Fast</div>
                <div className="mt-1">Instant navigation, lightweight UI, clean layout.</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="font-medium text-white">Secure</div>
                <div className="mt-1">Supabase auth with session handling.</div>
              </div>
            </div>
          </div>

          <Card className="mx-auto w-full max-w-md border-white/10 bg-white/5 text-white shadow-xl backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription className="text-white/70">
                Use your email and password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/90">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => router.push('/forgot-password')}
                      className="text-xs text-white/70 underline-offset-4 hover:text-white hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/40"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/40"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
                  >
                    Create account
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-slate-900 hover:bg-white/90"
                >
                  {isLoading ? 'Signing in…' : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-white/60">
                  By continuing you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
