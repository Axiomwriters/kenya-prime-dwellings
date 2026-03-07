import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const SyncPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    const checkSupabaseRecord = async () => {
      let retries = 5;
      while (retries > 0) {
        const { data, error } = await supabase
          .from('profiles')
          .select('clerk_user_id')
          .eq('clerk_user_id', user.id)
          .single();

        if (data) {
          // Record found, proceed with role-based redirect
          const role = user.unsafeMetadata.role as string;
          switch (role) {
            case 'agent':
              navigate('/dashboard/agent', { replace: true });
              break;
            case 'host':
              navigate('/dashboard/short-stay', { replace: true });
              break;
            case 'tenant':
              navigate('/dashboard/tenant', { replace: true });
              break;
            case 'admin':
              navigate('/admin', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
          return;
        }

        // Record not found, wait and retry
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // If after 5 seconds the record is still not there, redirect to an error page or show a message
      navigate('/error', { state: { message: 'Failed to sync your account. Please contact support.' } });
    };

    checkSupabaseRecord();
  }, [isLoaded, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Finalizing your account setup...
        </p>
      </div>
    </div>
  );
};

export default SyncPage;
