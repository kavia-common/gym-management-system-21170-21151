import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { getSupabaseClient, signInWithEmailPassword, signOut as supaSignOut } from '../lib/supabaseClient';
import { fetchWithAuth } from '../api/client';
import api from '../services/apiClient';
import { getRedirectUriForAuthCallback } from '../config/oauth';

/**
 * PUBLIC_INTERFACE
 * useSupabaseAuth: Hook to access Supabase auth context.
 */
/**
 * AuthContext value shape
 * @typedef {Object} AuthContextValue
 * @property {any|null} user
 * @property {any|null} session
 * @property {any|null} profile
 * @property {'member'|'trainer'|'admin'|null} role
 * @property {boolean} loading
 * @property {boolean} ready
 * @property {boolean} isAuthenticated
 * @property {(email:string, password:string)=>Promise<any>} signIn
 * @property {(email:string, password:string)=>Promise<any>} signUp
 * @property {()=>Promise<void>} signOut
 * @property {()=>Promise<string|null>} getAccessToken
 */
const AuthContext = createContext(/** @type {AuthContextValue|null} */(null));

/**
 * Helper to build /api/me URL respecting whether API_BASE_URL ends with /api/v1 or is a plain host.
 */
function getMeUrl() {
  const base = api.getBaseUrl();
  if (!base || typeof base !== 'string') {
    // Fallback to relative path; backend router should handle /api/me
    return '/api/me';
  }
  return `${base}/../..`.endsWith('/api/v1')
    ? `${base.replace(/\/api\/v1$/, '')}/api/me`
    : `${base}/api/me`;
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider: wraps the app and provides:
 * - user: Supabase user object (or null)
 * - session: Supabase session (or null)
 * - loading: boolean while restoring session and fetching profile
 * - role: 'trainer' | 'member' | 'admin' | null (null while loading or unauthenticated)
 * - profile: object from /api/me (shape { user_id, email?, role })
 * - ready: boolean when initial bootstrap is done (prevents UI flicker)
 * - signIn(email, password)
 * - signUp(email, password)
 * - signOut()
 * - getAccessToken(): string | null
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // /api/me payload
  const [role, setRole] = useState(null); // derived from /api/me
  const [loading, setLoading] = useState(true); // auth+profile loading
  const [ready, setReady] = useState(false); // one-time init done

  // Fetch /api/me using Supabase access token
  const loadMe = useCallback(async () => {
    // Load the role/profile derived from backend; ensure consistent state
    try {
      if (!session?.access_token) {
        // No session -> ensure cleared and do not fetch
        setProfile(null);
        setRole(null);
        return;
      }
      const resp = await fetchWithAuth(getMeUrl());
      if (!resp.ok) {
        // If backend not ready or unauthorized, keep unauth state without throwing
        try { await resp.text(); } catch {}
        setProfile(null);
        setRole(null);
        return;
      }
      const json = await resp.json();
      setProfile(json || null);
      setRole(json?.role || null);
    } catch {
      setProfile(null);
      setRole(null);
    }
  }, [session]);

  // Initialize and subscribe to auth state changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const sess = data.session || null;
        setSession(sess);
        setUser(sess?.user || null);
        // Load profile only if have session
        if (sess?.access_token) {
          await loadMe();
        } else {
          setProfile(null);
          setRole(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setReady(true);
        }
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
      setLoading(true);
      await loadMe();
      setLoading(false);
      // keep ready true after first init
      setReady(true);
    });

    return () => {
      mounted = false;
      try {
        // @supabase/supabase-js v2 returns { data: { subscription } }
        sub?.subscription?.unsubscribe?.();
      } catch {
        // ignore
      }
    };
  }, [supabase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Role is derived from backend /api/me (Supabase-authenticated) response.
  // accepted roles: 'member' | 'trainer' | 'admin'
  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      ready,
      isAuthenticated: !!session?.access_token,
      // PUBLIC_INTERFACE
      async signIn(email, password) {
        const { error, data } = await signInWithEmailPassword(email, password);
        if (error) throw error;
        try { await loadMe(); } catch {}
        return data;
      },
      // PUBLIC_INTERFACE
      async signUp(email, password) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Use centralized redirect, which respects REACT_APP_GOOGLE_OAUTH_REDIRECT_URI or SITE_URL/auth/callback
            emailRedirectTo: getRedirectUriForAuthCallback({ preferProvider: 'google' }),
          },
        });
        if (error) throw error;
        // If session exists immediately (confirmation disabled), fetch profile
        if (data?.session?.access_token) {
          try { await loadMe(); } catch {}
        }
        return data;
      },
      // PUBLIC_INTERFACE
      async signOut() {
        const { error } = await supaSignOut();
        if (error) throw error;
        setProfile(null);
        setRole(null);
      },
      // PUBLIC_INTERFACE
      async getAccessToken() {
        const { data } = await supabase.auth.getSession();
        return data.session?.access_token || null;
      },
    }),
    [user, session, profile, role, loading, ready, supabase, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useSupabaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within AuthProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * PUBLIC_INTERFACE
   * useAuth: Alias to useSupabaseAuth for consumers expecting useAuth.
   * Returns the full auth context with { user, session, profile, role, isAuthenticated, loading, ready, ...actions }.
   */
  return useSupabaseAuth();
}

// PUBLIC_INTERFACE
export function useRole() {
  /**
   * PUBLIC_INTERFACE
   * useRole: Returns current role ('trainer'|'member'|'admin') or null while loading/unauthenticated.
   */
  const { role } = useSupabaseAuth();
  return role || null;
}
