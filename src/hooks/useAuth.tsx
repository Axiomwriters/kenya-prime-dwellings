import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  userRole: 'user' | 'agent' | 'admin' | null;
  isAgent: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
  mockSignIn: () => Promise<{ error: Error | null }>; // Kept for interface compatibility but will warn
  viewMode: 'buyer' | 'renter';
  toggleViewMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'agent' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- View Mode Toggle (Buyer/Renter) ---
  const [viewMode, setViewMode] = useState<'buyer' | 'renter'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_view_mode');
      return (saved === 'buyer' || saved === 'renter') ? saved : 'buyer';
    }
    return 'buyer';
  });

  const toggleViewMode = () => {
    setViewMode(prev => {
      const next = prev === 'buyer' ? 'renter' : 'buyer';
      localStorage.setItem('user_view_mode', next);
      toast.success(`Switched to ${next === 'buyer' ? 'Buyer' : 'Renter'} mode`);
      return next;
    });
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
      } else {
        setUserRole(data?.role as 'user' | 'agent' | 'admin');
      }
    } catch (e) {
      console.error('Exception fetching role:', e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
  };

  const refreshRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  const mockSignIn = async () => {
    // Deprecated in favor of real auth
    toast.info("Using Supabase Auth now. Please use Email/Password.");
    return { error: new Error("Mock login deprecated") };
  };

  const isAuthenticated = !!session;
  const isAgent = userRole === 'agent' || userRole === 'admin';
  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      userRole,
      isAgent,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
      refreshRole,
      mockSignIn,
      viewMode,
      toggleViewMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
