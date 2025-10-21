import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useSupabaseAuth: Hook to access Supabase auth context.
 */
const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider: wraps the app and provides:
 * - user: Supabase user object (or null)
 * - session: Supabase session (or null)
 * - loading: boolean while restoring session
 * - signIn(email, password)
 * - signUp(email, password)
 * - signOut()
 * - getAccessToken(): string | null
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and subscribe to auth state changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session || null);
        setUser(data.session?.user || null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
    });

    return () => {
      mounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: !!session?.access_token,
      // PUBLIC_INTERFACE
      async signIn(email, password) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // session will be updated by onAuthStateChange
        return data;
      },
      // PUBLIC_INTERFACE
      async signUp(email, password) {
        const siteUrl =
          process.env.REACT_APP_SITE_URL ||
          (typeof window !== 'undefined' ? window.location.origin : undefined);
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: siteUrl || undefined,
          },
        });
        if (error) throw error;
        return data;
      },
      // PUBLIC_INTERFACE
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      // PUBLIC_INTERFACE
      async getAccessToken() {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
      },
    }),
    [user, session, loading, supabase]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within AuthProvider');
  return ctx;
}
