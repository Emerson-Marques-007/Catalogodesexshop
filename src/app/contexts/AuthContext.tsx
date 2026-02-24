import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

const API_BASE = `${supabaseUrl}/functions/v1/make-server-23ba5d8a`;

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  getValidToken: () => Promise<string | null>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Build headers for authenticated requests to our Edge Function.
 * - Authorization: Bearer <anonKey>  → passes the Supabase gateway JWT check
 * - X-User-Token: <accessToken>      → our Hono middleware reads the real user token
 */
const buildAuthHeaders = (userToken: string, extra?: Record<string, string>): Record<string, string> => ({
  'Authorization': `Bearer ${publicAnonKey}`,
  'X-User-Token': userToken,
  'Content-Type': 'application/json',
  ...extra,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  // Helper: get a fresh, valid access token
  const getValidToken = useCallback(async (): Promise<string | null> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) return null;
        return refreshData.session.access_token;
      }

      // Refresh proactively if token expires within 60s
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at - now < 60) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        return refreshData.session?.access_token ?? session.access_token;
      }

      return session.access_token;
    } catch (error) {
      console.error('Error getting valid token:', error);
      return null;
    }
  }, []);

  /**
   * Convenience wrapper: fetches with correct auth headers.
   * Components should use this instead of raw fetch() for authenticated endpoints.
   */
  const authFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getValidToken();
    if (!token) throw new Error('No valid session');

    const headers = buildAuthHeaders(token);
    // Merge caller headers (but let caller override Content-Type if needed, e.g. FormData)
    const callerHeaders = options.headers instanceof Headers
      ? Object.fromEntries((options.headers as Headers).entries())
      : (options.headers as Record<string, string>) ?? {};

    const finalHeaders = { ...headers, ...callerHeaders };

    // For FormData bodies, remove Content-Type so the browser sets multipart boundary
    if (options.body instanceof FormData) {
      delete finalHeaders['Content-Type'];
    }

    return fetch(url, {
      ...options,
      headers: finalHeaders,
    });
  }, [getValidToken]);

  // Fetch user profile data from our backend
  const fetchUserData = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: buildAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Failed to fetch user data: status=${response.status}, error=${JSON.stringify(errorData)}`);
        throw new Error(errorData.error || `Failed to fetch user data (HTTP ${response.status})`);
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // Initialize auth
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initSession = async () => {
      try {
        // Use getSession first — it returns the cached session (cheap).
        // Then verify it's still alive by calling getUser (hits Supabase auth).
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.access_token) {
          setAccessToken(session.access_token);
          await fetchUserData(session.access_token);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Keep state in sync with future auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAccessToken(null);
          setUser(null);
          return;
        }
        if (session.access_token) {
          setAccessToken(session.access_token);
        }
      }
    );

    return () => { subscription.unsubscribe(); };
  }, [fetchUserData]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session?.access_token) {
        setAccessToken(data.session.access_token);
        await fetchUserData(data.session.access_token);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao criar conta');

      // Auto-login after signup
      await login(email, password);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    const token = await getValidToken();
    if (token) await fetchUserData(token);
  };

  const value: AuthContextType = {
    user,
    loading,
    accessToken,
    login,
    signup,
    logout,
    refreshUser,
    isAdmin: user?.role === 'admin',
    getValidToken,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};