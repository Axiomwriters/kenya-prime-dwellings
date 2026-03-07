// src/pages/SignIn.tsx — Headless Clerk with custom UI
import { useAuth, useSignIn, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeOff, Home, Loader2 } from 'lucide-react'

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const navigate = useNavigate()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)

  useEffect(() => {
    if (!isLoaded || !isUserLoaded || !isSignedIn) {
      return
    }

    const role = user?.unsafeMetadata?.role as string | undefined
    if (role === 'agent') {
      navigate('/dashboard/agent', { replace: true })
      return
    }

    navigate('/onboarding/sync', { replace: true })
  }, [isLoaded, isSignedIn, isUserLoaded, navigate, user])

  /* ── Google OAuth ──────────────────────────────────── */
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return
    setLoading(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: '/redirect',
      })
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? 'Google sign-in failed')
      setLoading(false)
    }
  }

  /* ── Email / Password ──────────────────────────────── */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        navigate('/redirect', { replace: true })
      } else {
        // Handle MFA or other factors if needed in future
        toast.error('Sign-in requires additional steps. Please contact support.')
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-md mx-auto w-full">

          <Link to="/" className="flex items-center gap-2 mb-10 group w-fit">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">Savanah Dwelling</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-6">Sign in to continue to your dashboard.</p>

          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-11 gap-2 mb-4"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-2">or with email</span></div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs">Email address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" required className="mt-1 h-10" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <Link to="/auth/reset" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading || !isLoaded}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary hover:underline font-medium">Create account</Link>
          </p>
        </div>
      </div>

      {/* Right column — branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 text-center p-12 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Find Your Dream Property
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Join thousands of Kenyans buying, renting, and managing properties on Savanah Dwelling.
          </p>
          <p className="text-gray-500 text-sm mt-4">Powered by Kenya Prime Dwellings · PataHome</p>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>
    </div>
  )
}
