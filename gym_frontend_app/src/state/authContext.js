import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * useAuth: Hook to access auth context.
 */
const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'gym.tokens';

function getStoredTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredTokens(tokens) {
  if (!tokens) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider: Provides auth state, actions, and user profile.
 */
export function LegacyAuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => getStoredTokens());
  const [user, setUser] = useState(null);
  const isAuthenticated = !!(tokens?.access_token);

  // Attach tokens to api client
  useEffect(() => {
    api.setAuthTokens(tokens);
    setStoredTokens(tokens || null);
    // fetch profile on login
    const fetchMe = async () => {
      if (!tokens?.access_token) {
        setUser(null);
        return;
      }
      try {
        const me = await api.get('/auth/me');
        setUser(me);
      } catch {
        setUser(null);
      }
    };
    fetchMe();
  }, [tokens]);

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    tokens,
    // PUBLIC_INTERFACE
    async login(email, password) {
      const res = await api.post('/auth/login', { email, password });
      setTokens(res);
      return res;
    },
    // PUBLIC_INTERFACE
    async signup(email, password) {
      await api.post('/auth/signup', { email, password });
      const tk = await api.post('/auth/login', { email, password });
      setTokens(tk);
      return tk;
    },
    // PUBLIC_INTERFACE
    async logout() {
      try { await api.post('/auth/logout', {}); } catch {}
      setTokens(null);
      setUser(null);
    },
    // PUBLIC_INTERFACE
    async refresh() {
      if (!tokens?.refresh_token) return null;
      const refreshed = await api.post('/auth/refresh', { refresh_token: tokens.refresh_token });
      setTokens(refreshed);
      return refreshed;
    }
  }), [isAuthenticated, user, tokens]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
