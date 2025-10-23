// src/config/oauth.js

// PUBLIC_INTERFACE
/**
 * Centralized OAuth configuration and helpers for Google (via Supabase) and GitHub.
 * Reads values from canonical environment variables and optional runtime config (window.__APP_CONFIG__).
 * Canonical env keys (frontend-safe only):
 *  - REACT_APP_GOOGLE_OAUTH_REDIRECT_URI
 *  - REACT_APP_GOOGLE_CLIENT_ID
 *  - REACT_APP_GITHUB_OAUTH_REDIRECT_URI
 *  - REACT_APP_GITHUB_CLIENT_ID
 * No client secrets are read on the frontend.
 *
 * Exports:
 *  - getRedirectUriForAuthCallback()
 *  - getGoogleOAuthConfig()
 *  - getGitHubOAuthConfig()
 *  - buildGitHubAuthorizeUrl()
 *
 * Behavior:
 *  - If Supabase is configured, defaults redirect to `${SITE_URL}/auth/callback` when provider redirect not set.
 *  - Adds development warnings when required envs are missing.
 */

import { getURL } from '../utils/getURL';

// Internal helper to read from runtime config if available
function readRuntime(key) {
  try {
    if (typeof window !== 'undefined' && window.__APP_CONFIG__) {
      return window.__APP_CONFIG__[key];
    }
  } catch {
    // ignore
  }
  return undefined;
}

// Resolve canonical env vars from process.env or runtime
function env(key) {
  // Prefer process.env first, then runtime using non-prefixed key
  const fromEnv = process.env[key];
  if (typeof fromEnv !== 'undefined') return fromEnv;
  const rtKey = key.startsWith('REACT_APP_') ? key.slice('REACT_APP_'.length) : key;
  return readRuntime(rtKey);
}

/**
 * PUBLIC_INTERFACE
 * Determine the OAuth redirect URI used for /auth/callback flows.
 * Priority:
 * - For Google: REACT_APP_GOOGLE_OAUTH_REDIRECT_URI if set
 * - For GitHub: REACT_APP_GITHUB_OAUTH_REDIRECT_URI if set
 * - If Supabase URL is present, default to `${SITE_URL}/auth/callback`
 * - Fallback to SITE_URL/auth/callback
 * - Final fallback to current origin from getURL()
 */
export function getRedirectUriForAuthCallback({ preferProvider } = {}) {
  // Explicit provider-specific override
  if (preferProvider === 'google') {
    const googleEnv = env('REACT_APP_GOOGLE_OAUTH_REDIRECT_URI');
    if (googleEnv) return googleEnv;
  }
  if (preferProvider === 'github') {
    const ghEnv = env('REACT_APP_GITHUB_OAUTH_REDIRECT_URI');
    if (ghEnv) return ghEnv;
  }

  // Any provider-specific env set?
  const anyProvider =
    env('REACT_APP_GOOGLE_OAUTH_REDIRECT_URI') ||
    env('REACT_APP_GITHUB_OAUTH_REDIRECT_URI');

  if (anyProvider) {
    return anyProvider;
  }

  // If Supabase configured, prefer SITE_URL/auth/callback as default
  const supabaseUrl = env('REACT_APP_SUPABASE_URL');
  const site = env('REACT_APP_SITE_URL');
  if (supabaseUrl && site) {
    return site.endsWith('/') ? `${site}auth/callback` : `${site}/auth/callback`;
  }

  // SITE_URL-based fallback
  if (site) {
    return site.endsWith('/') ? `${site}auth/callback` : `${site}/auth/callback`;
  }

  // Final fallback to current origin
  return `${getURL()}auth/callback`;
}

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
};

// PUBLIC_INTERFACE
export function getGoogleOAuthConfig() {
  /** Returns Google OAuth config based on env/runtime. */
  const clientId = env('REACT_APP_GOOGLE_CLIENT_ID') || null;

  const redirectUri =
    env('REACT_APP_GOOGLE_OAUTH_REDIRECT_URI') ||
    getRedirectUriForAuthCallback({ preferProvider: 'google' });

  if (process.env.NODE_ENV !== 'production') {
    const missing = [];
    if (!env('REACT_APP_SUPABASE_URL')) missing.push('REACT_APP_SUPABASE_URL');
    if (!env('REACT_APP_SUPABASE_KEY')) missing.push('REACT_APP_SUPABASE_KEY');
    if (!clientId) missing.push('REACT_APP_GOOGLE_CLIENT_ID');
    if (!redirectUri) missing.push('REACT_APP_GOOGLE_OAUTH_REDIRECT_URI or SITE_URL');
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `[oauth] Dev warning: Missing environment variables for Google OAuth: ${missing.join(
          ', '
        )}. Configure .env and restart the app.`
      );
    }
  }

  return {
    clientId,
    redirectUri,
  };
}

// PUBLIC_INTERFACE
export function getGitHubOAuthConfig() {
  /** Returns GitHub OAuth config based on env/runtime. */
  const clientId = env('REACT_APP_GITHUB_CLIENT_ID') || null;

  const redirectUri =
    env('REACT_APP_GITHUB_OAUTH_REDIRECT_URI') ||
    getRedirectUriForAuthCallback({ preferProvider: 'github' });

  if (process.env.NODE_ENV !== 'production') {
    const missing = [];
    if (!clientId) missing.push('REACT_APP_GITHUB_CLIENT_ID');
    if (!redirectUri) missing.push('REACT_APP_GITHUB_OAUTH_REDIRECT_URI or SITE_URL');
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `[oauth] Dev warning: Missing environment variables for GitHub OAuth: ${missing.join(
          ', '
        )}. Configure .env and restart the app.`
      );
    }
  }

  return {
    clientId,
    redirectUri,
    scope: 'read:user user:email',
  };
}

// PUBLIC_INTERFACE
export function buildGitHubAuthorizeUrl(overrides = {}) {
  /**
   * Build the GitHub OAuth authorize URL using centralized config.
   * Allows overrides: { clientId, redirectUri, scope, state }
   */
  const { clientId, redirectUri, scope } = { ...getGitHubOAuthConfig(), ...overrides };
  const state = overrides.state;

  if (!clientId) throw new Error('Missing GitHub clientId');
  if (!redirectUri) throw new Error('Missing GitHub redirectUri');

  const base = 'https://github.com/login/oauth/authorize';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope || 'read:user user:email',
  });
  if (state) params.set('state', state);
  return `${base}?${params.toString()}`;
}
