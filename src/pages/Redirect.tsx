// src/pages/Redirect.tsx
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Redirect() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (processed.current) return;

    const syncRole = async () => {
      try {
        let role = user.unsafeMetadata?.role as string | undefined;

        // If Clerk metadata has no role, fall back to what user selected
        // in the signup form (stored in localStorage)
        if (!role) {
          role = localStorage.getItem('selectedRole') || 'buyer';

          await user.update({
            unsafeMetadata: {
              role,
              onboardingComplete: role === 'agent' || role === 'host' ? false : true,
            },
          });

          await user.reload();
        }

        // Clean up after role is confirmed
        localStorage.removeItem('selectedRole');
        processed.current = true;

        switch (role) {
          case 'agent':
            navigate('/agent', { replace: true });
            break;
          case 'host':
            navigate('/host', { replace: true });  // ← was incorrectly '/agent'
            break;
          case 'admin':
            navigate('/command-center', { replace: true });
            break;
          case 'professional':
            navigate('/professional', { replace: true });
            break;
          case 'buyer':
          default:
            navigate('/', { replace: true });
            break;
        }
      } catch (err) {
        console.error('Role sync error:', err);
        navigate('/auth', { replace: true });
      }
    };

    syncRole();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">
        Setting up your account…
      </p>
    </div>
  );
}
