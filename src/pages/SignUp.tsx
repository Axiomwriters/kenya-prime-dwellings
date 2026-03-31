import { useSignUp } from '@clerk/clerk-react';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Home, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setSelectedRole, getSelectedRole } from '@/utils/role-selection';
import { resolveDashboard } from '@/utils/roleRedirect';
import { supabase } from '@/integrations/supabase/client';
import { validatePassword, validateEmail } from '@/utils/validation';
import { isValidRole, ROLE_CONFIG, AppRole } from '@/types/auth';

type Step = 'role' | 'credentials' | 'verify';

const ROLES = [
  { value: 'tenant',        label: ' Buyer / Renter',     desc: 'Browse & save properties' },
  { value: 'agent',        label: ' Real Estate Agent',  desc: 'List & manage properties' },
  { value: 'host',         label: ' AirBnb Host',    desc: 'List vacation & short-stay rentals' },
  { value: 'professional', label: ' Professional',        desc: 'Offer property-related services' },
];

const DEBOUNCE_MS = 300;

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleFromQuery = searchParams.get('role');
  const validatedRoleFromQuery = roleFromQuery && isValidRole(roleFromQuery) ? roleFromQuery : null;
  const isPresetRole = validatedRoleFromQuery === 'agent' || validatedRoleFromQuery === 'host';

  const [step, setStep] = useState<Step>(isPresetRole ? 'credentials' : 'role');
  const [selectedRole, setRole] = useState<AppRole>(validatedRoleFromQuery as AppRole || 'tenant');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } | null>(null);

  useEffect(() => {
    if (isPresetRole && validatedRoleFromQuery) {
      setSelectedRole(validatedRoleFromQuery);
    }
  }, [isPresetRole, validatedRoleFromQuery]);

  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [password]);

  const checkEmailExists = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || !validateEmail(emailToCheck)) return;
    
    setEmailCheckLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', emailToCheck.toLowerCase())
        .maybeSingle();
      
      setEmailExists(!!data);
    } catch (err) {
      console.error('Email check error:', err);
    } finally {
      setEmailCheckLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) checkEmailExists(email);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [email, checkEmailExists]);

  const handleRoleContinue = () => {
    if (!selectedRole || !isValidRole(selectedRole)) {
      toast.error('Please select a valid role');
      return;
    }
    setSelectedRole(selectedRole);
    setStep('credentials');
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    if (!selectedRole || !isValidRole(selectedRole)) {
      toast.error('Please select a role first');
      return;
    }
    setLoading(true);
    try {
      setSelectedRole(selectedRole);
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: '/onboarding/sync',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-up failed';
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError.errors?.[0]?.message ?? errorMessage);
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!passwordValidation || !passwordValidation.isValid) {
      toast.error(passwordValidation?.errors?.[0] || 'Password does not meet requirements');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (emailExists) {
      toast.error('An account with this email already exists. Please sign in.');
      return;
    }

    if (!selectedRole || !isValidRole(selectedRole)) {
      toast.error('Invalid role selected');
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.toLowerCase().trim(),
        password,
        unsafeMetadata: {
          role: selectedRole,
          onboardingComplete: false,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      toast.success('Verification code sent to your email!');
      setStep('verify');
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError.errors?.[0]?.message ?? 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!code || code.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });

        if (!result.createdSessionId) {
          toast.error('Failed to create session. Please try again.');
          setLoading(false);
          return;
        }

        const role = (result.unsafeMetadata?.role as AppRole) || selectedRole;
        const userEmail = result.emailAddress || email;

        if (role === 'agent' || role === 'host' || role === 'professional') {
          try {
            const { error: fnError } = await supabase.functions.invoke(
              'send-branded-confirmation-email',
              {
                body: {
                  clerk_user_id: result.createdUserId,
                  email: userEmail,
                  first_name: firstName || result.firstName,
                  role: role,
                },
              }
            );

            if (fnError) {
              console.error('Failed to send branded email:', fnError);
            }
          } catch (emailError) {
            console.error('Email send error:', emailError);
          }

          navigate(`/email-confirmation?role=${role}&email=${encodeURIComponent(userEmail)}`, { replace: true });
        } else {
          const destination = resolveDashboard(role);
          navigate(destination, { replace: true });
        }

      } else {
        toast.error('Verification incomplete. Check your code and try again.');
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError.errors?.[0]?.message ?? 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      toast.success('New code sent!');
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError.errors?.[0]?.message ?? 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex bg-background">
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 mb-10 group w-fit">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">Savanah Dwelling</span>
          </Link>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 text-center p-12 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Join Savanah Dwelling
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Kenya's most trusted real estate ecosystem. Buyers, agents, hosts, and professionals — all in one place.
          </p>
          <p className="text-gray-500 text-sm mt-4">Powered by Savanah Dwelling</p>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>
    </div>
  );

  if (step === 'role') {
    return (
      <Shell>
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-muted-foreground text-sm mb-6">Choose the role that best describes you.</p>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value as AppRole)}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                selectedRole === r.value
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              {selectedRole === r.value && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <Button 
          className="w-full h-11" 
          onClick={handleRoleContinue}
          disabled={!selectedRole}
        >
          Continue as {ROLES.find(r => r.value === selectedRole)?.label}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </Shell>
    );
  }

  if (step === 'credentials') {
    return (
      <Shell>
        <button 
          onClick={() => {
            const persistedRole = getSelectedRole();
            if (persistedRole && isValidRole(persistedRole)) {
              setRole(persistedRole as AppRole);
              if (persistedRole === 'agent' || persistedRole === 'host') {
                setStep('credentials');
                return;
              }
            }
            setStep('role');
          }} 
          className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold mb-1">Your details</h1>
        <p className="text-muted-foreground text-sm mb-5">
          Signing up as <span className="font-medium text-foreground capitalize">{ROLE_CONFIG[selectedRole]?.label || selectedRole}</span>
        </p>

        <Button
          variant="outline"
          className="w-full h-11 gap-2 mb-4"
          onClick={handleGoogleSignUp}
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

        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName" className="text-xs">First name</Label>
              <Input 
                id="firstName" 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)} 
                placeholder="Jane" 
                required 
                className="mt-1 h-10" 
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs">Last name</Label>
              <Input 
                id="lastName" 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                placeholder="Doe" 
                required 
                className="mt-1 h-10"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">Email address</Label>
            <div className="relative mt-1">
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="jane@example.com" 
                required 
                className={cn(
                  "mt-1 h-10", 
                  emailExists && "border-red-500 focus:ring-red-500"
                )}
                autoComplete="email"
              />
              {emailCheckLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {emailExists && !emailCheckLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              )}
            </div>
            {emailExists && !emailCheckLoading && (
              <p className="text-xs text-red-500 mt-1">An account with this email already exists</p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="h-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordValidation && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-1">
                  <div className={cn("h-1 flex-1 rounded-full", passwordValidation.strength === 'weak' ? 'bg-red-500' : passwordValidation.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500')} />
                  <div className={cn("h-1 flex-1 rounded-full", passwordValidation.strength === 'medium' || passwordValidation.strength === 'strong' ? (passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-yellow-500') : 'bg-gray-200')} />
                  <div className={cn("h-1 flex-1 rounded-full", passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200')} />
                </div>
                <div className="space-y-1">
                  {passwordValidation.errors.map((error, i) => (
                    <p key={i} className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="mt-1 h-10"
              autoComplete="new-password"
            />
            {confirmPassword && password && confirmPassword !== password && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Passwords do not match
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 mt-2" 
            disabled={loading || !isLoaded || emailExists || !passwordValidation?.isValid || password !== confirmPassword}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-primary hover:underline">Sign in</Link>
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-1">Check your email</h1>
      <p className="text-muted-foreground text-sm mb-6">
        We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your account.
      </p>
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Label htmlFor="code" className="text-xs">Verification code</Label>
          <Input
            id="code"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            required
            maxLength={6}
            className="mt-1 h-11 text-center text-xl tracking-widest font-mono"
            autoComplete="one-time-code"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-11" 
          disabled={loading || !isLoaded || code.length !== 6}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Didn't receive it?{' '}
        <button
          className="text-primary hover:underline"
          onClick={resendCode}
          disabled={loading}
        >
          Resend code
        </button>
      </p>
    </Shell>
  );
}
