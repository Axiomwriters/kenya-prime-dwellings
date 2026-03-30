
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Step = 'checking' | 'waiting' | 'confirmed' | 'expired' | 'error';

const ROLE_LABELS: Record<string, string> = {
  agent: 'Real Estate Agent',
  host: 'Airbnb Host',
  professional: 'Professional',
};

export default function EmailConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  const token = searchParams.get('token');
  const role = (searchParams.get('role') || 'agent') as 'agent' | 'host' | 'professional';
  const emailParam = searchParams.get('email');

  const [step, setStep] = useState<Step>('checking');
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  const email = emailParam || user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    // If user has token from email link, validate it
    if (token) {
      validateToken(token);
      return;
    }

    // Otherwise show waiting state
    if (!isSignedIn) {
      navigate('/sign-in', { replace: true });
      return;
    }

    // Check if user already has an active session
    checkExistingSession();
  }, [authLoaded, userLoaded, token, isSignedIn]);

  const validateToken = async (confirmationToken: string) => {
    try {
      setLoading(true);
      
      // Call the database function to mark as clicked
      const { data, error } = await supabase.rpc('get_confirmation_by_token', {
        p_token: confirmationToken,
      });

      if (error || !data || data.length === 0) {
        setStep('expired');
        return;
      }

      const session = data[0];

      // Check if expired
      if (new Date(session.expires_at) < new Date()) {
        setStep('expired');
        return;
      }

      // Check if already clicked
      if (session.status === 'clicked') {
        // Already confirmed, proceed to verification
        navigate(`/verification?role=${session.role}`, { replace: true });
        return;
      }

      // Mark as clicked
      await supabase.rpc('mark_confirmation_clicked', {
        p_token: confirmationToken,
      });

      setSessionData(session);
      setStep('confirmed');

      // Redirect to verification after short delay
      setTimeout(() => {
        navigate(`/verification?role=${session.role}`, { replace: true });
      }, 2000);

    } catch (error) {
      console.error('Token validation error:', error);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('email_confirmation_sessions')
        .select('*')
        .eq('clerk_user_id', user.id)
        .eq('role', role)
        .in('status', ['sent', 'opened', 'clicked'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        if (data.status === 'clicked') {
          // Already confirmed, go to verification
          navigate(`/verification?role=${data.role}`, { replace: true });
          return;
        }
        setSessionData(data);
        setStep('waiting');
      } else {
        // No session, redirect to sign-up
        navigate('/sign-up', { replace: true });
      }
    } catch (error) {
      console.error('Session check error:', error);
      navigate('/sign-up', { replace: true });
    }
  };

  const handleResendEmail = async () => {
    if (!user || !email) {
      toast.error('Unable to resend email. Please sign in again.');
      return;
    }

    try {
      setLoading(true);

      // Get the edge function URL
      const { data: fnData } = await supabase.functions.invoke(
        'send-branded-confirmation-email',
        {
          body: {
            clerk_user_id: user.id,
            email: email,
            first_name: user.firstName,
            role: role,
          },
        }
      );

      if (fnData?.success) {
        toast.success('Confirmation email sent! Check your inbox.');
      } else {
        throw new Error(fnData?.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Failed to resend email');
    } finally {
      setLoading(false);
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
            Confirm Your Account
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            You're almost there! Check your email to complete registration as a {ROLE_LABELS[role]}.
          </p>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      </div>
    </div>
  );

  if (!authLoaded || !userLoaded || step === 'checking') {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </Shell>
    );
  }

  if (step === 'expired') {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link Expired</h1>
          <p className="text-muted-foreground mb-6">
            This confirmation link has expired. Please request a new one.
          </p>
          <Button onClick={handleResendEmail} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Resend Confirmation Email
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/sign-up" className="text-primary hover:underline">
              Back to Sign Up
            </Link>
          </p>
        </div>
      </Shell>
    );
  }

  if (step === 'error') {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't validate your confirmation link. Please try again.
          </p>
          <Button onClick={() => navigate('/sign-up', { replace: true })}>
            Back to Sign Up
          </Button>
        </div>
      </Shell>
    );
  }

  if (step === 'confirmed') {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Email Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Redirecting you to complete verification...
          </p>
          <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  // Default: waiting state
  return (
    <Shell>
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-2">
          We sent a confirmation link to
        </p>
        <p className="font-medium text-foreground mb-6">{email}</p>
        
        <div className="p-4 bg-muted rounded-lg mb-6 text-left">
          <p className="text-sm text-muted-foreground">
            <strong>Next step:</strong> Click the link in the email to confirm your account as a {ROLE_LABELS[role]}.
          </p>
        </div>

        <Button 
          onClick={handleResendEmail} 
          disabled={loading}
          variant="outline"
          className="w-full mb-4"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            "Resend Email"
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or{' '}
          <button 
            onClick={handleResendEmail}
            className="text-primary hover:underline"
          >
            request a new one
          </button>
        </p>

        <div className="border-t border-border mt-6 pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            Already confirmed?
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/verification?role=${role}`)}
          >
            Continue to Verification →
          </Button>
        </div>
      </div>
    </Shell>
  );
}
