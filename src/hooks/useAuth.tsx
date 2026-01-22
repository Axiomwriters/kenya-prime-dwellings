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
  mockSignIn: (role?: 'user' | 'agent' | 'professional') => Promise<{ error: Error | null }>;
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
    // Initial state: not logged in for mock build
    setLoading(false);
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
    return mockSignIn('user');
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return mockSignIn('user');
  };

  const signOut = async () => {
    // Clear local state
    setUser(null);
    setSession(null);
    setUserRole(null);
    
    // Clear any local storage
    localStorage.removeItem('supabase.auth.token');
    
    toast.success("Successfully signed out");
    navigate("/auth");
  };

  const refreshRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  const mockSignIn = async (role: 'user' | 'agent' | 'professional' = 'user') => {
    setLoading(true);
    // Simulate a user object
    const mockUser = {
      id: 'mock-id',
      email: 'mock@example.com',
      user_metadata: { full_name: 'Mock User' }
    } as any;
    
    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    } as any;

    setSession(mockSession);
    setUser(mockUser);
    setUserRole(role === 'professional' ? 'agent' : role as any); // Mapping professional to agent role for dashboard access
    setLoading(false);
    
    return { error: null };
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
