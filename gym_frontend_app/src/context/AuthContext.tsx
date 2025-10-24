import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Note: This TSX AuthContext is the canonical provider/hook for auth in the app.
 * Ensure imports use: import { AuthProvider, useSupabaseAuth } from './context';
 * This avoids mixing with the legacy AuthContext.jsx which remains for backward compatibility.
 */
type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // PUBLIC_INTERFACE
  signInWithEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  // PUBLIC_INTERFACE
  signInWithGoogle?: () => Promise<void>;
  // PUBLIC_INTERFACE
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and subscribe to auth state changes
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const user = useMemo<User | null>(() => session?.user ?? null, [session]);

  const signInWithEmail = useCallback<AuthContextValue['signInWithEmail']>(async (email: string) => {
    const siteUrl = process.env.REACT_APP_SITE_URL;
    const emailRedirectTo = siteUrl ? `${siteUrl}/auth/callback` : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return {
      success: true,
      message: 'Check your email for a magic link to sign in.',
    };
  }, [supabase]);

  const maybeGoogleSignIn = useMemo(() => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const hasGoogle = !!googleClientId && googleClientId.trim().length > 0;
    if (!hasGoogle) return undefined;

    return async () => {
      // Use centralized resolver in config/oauth.js semantics:
      const siteUrl = process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI || process.env.REACT_APP_SITE_URL
        ? (process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI || (process.env.REACT_APP_SITE_URL?.endsWith('/') ? `${process.env.REACT_APP_SITE_URL}auth/callback` : `${process.env.REACT_APP_SITE_URL}/auth/callback`))
        : undefined;

      await supabase.auth.signInWithOAuth({
        provider: 'google', // enforce exact lowercase
        options: {
          redirectTo: siteUrl,
        },
      });
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const value: AuthContextValue = {
    session,
    user,
    loading,
    signInWithEmail,
    signInWithGoogle: maybeGoogleSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * PUBLIC_INTERFACE
 * useAuth: Primary hook for accessing auth context.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

/**
 * PUBLIC_INTERFACE
 * useRole: Returns current role if available from session's user metadata or null.
 * Note: The TS AuthContext focuses on session; role derivation can be customized.
 */
export const useRole = (): string | null => {
  const { user } = useAuth();
  // Try common places for role metadata if present
  const roleFromAppMeta =
    (user as any)?.app_metadata?.role ||
    (user as any)?.user_metadata?.role ||
    null;
  return roleFromAppMeta || null;
};

/**
 * PUBLIC_INTERFACE
 * useSupabaseAuth: Alias to useAuth for compatibility with existing imports.
 */
export const useSupabaseAuth = (): AuthContextValue => {
  return useAuth();
};
