import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

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
  mockSignIn: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const MOCK_USER = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: { full_name: 'Mock User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'user@example.com',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
} as User;

const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER,
} as Session;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'agent' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true); // No initial loading needed for mock
  const navigate = useNavigate();

  // Mock checking session on load (optional: could check localStorage)
  useEffect(() => {
    // Check local storage for mock session
    const storedSession = localStorage.getItem('mock_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
        setUserRole('user'); // Default role
      } catch (e) {
        console.error("Failed to parse stored session", e);
      }
    }
    setLoading(false);
  }, []);

  const refreshRole = async () => {
    // Mock refresh role
    setUserRole('user');
  };

  const persistSession = (session: Session) => {
    localStorage.setItem('mock_session', JSON.stringify(session));
    setSession(session);
    setUser(session.user);
    // Determine role based on email or random/default
    if (session.user.email?.includes('admin')) {
      setUserRole('admin');
    } else if (session.user.email?.includes('agent')) {
      setUserRole('agent');
    } else {
      setUserRole('user');
    }
  };

  const signIn = async (email: string, password: string) => {
    // Allow any email/password for mock
    if (!email || !password) {
      return { error: new Error("Email and password are required") };
    }

    const mockUser = {
      ...MOCK_USER,
      email: email,
      user_metadata: { ...MOCK_USER.user_metadata, full_name: email.split('@')[0] }
    } as User;

    const session = {
      ...MOCK_SESSION,
      user: mockUser
    } as Session;

    persistSession(session);
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) {
      return { error: new Error("All fields are required") };
    }

    const mockUser = {
      ...MOCK_USER,
      email: email,
      user_metadata: { ...MOCK_USER.user_metadata, full_name: fullName }
    } as User;

    const session = {
      ...MOCK_SESSION,
      user: mockUser
    } as Session;

    persistSession(session);
    return { error: null };
  };

  const mockSignIn = async () => {
    persistSession(MOCK_SESSION);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('mock_session');
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
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
      mockSignIn
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
