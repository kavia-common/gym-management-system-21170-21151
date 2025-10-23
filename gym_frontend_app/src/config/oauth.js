//
// src/config/oauth.js
//
// PUBLIC_INTERFACE
/**
 * Centralized OAuth configuration and helpers for Google (via Supabase) and GitHub.
 * Reads values from environment variables and optional runtime config (window.__APP_CONFIG__).
 * Provides helpers to:
 *  - getRedirectUriForAuthCallback()
 *  - getGoogleOAuthConfig()
 *  - getGitHubOAuthConfig()
 *  - buildGitHubAuthorizeUrl()
 * Includes development-time warnings if critical env vars are missing.
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

/**
 * Determine the OAuth redirect URI used for /auth/callback flows.
 * Priority:
 * - For Google: REACT_APP_GOOGLE_OAUTH_REDIRECT_URI if set
 * - For GitHub: REACT_APP_GITHUB_OAUTH_REDIRECT_URI if set
 * - Fallback to SITE_URL/auth/callback
 * - Final fallback to current origin from getURL()
 */
export function getRedirectUriForAuthCallback({ preferProvider } = {}) {
  // Explicit provider-specific override
  if (preferProvider === 'google') {
    const googleEnv = process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI || readRuntime('GOOGLE_OAUTH_REDIRECT_URI');
    if (googleEnv) return googleEnv;
  }
  if (preferProvider === 'github') {
    const ghEnv = process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI || process.env.REACT_APP_REACT_APP_GITHUB_OAUTH_REDIRECT_URI || readRuntime('GITHUB_OAUTH_REDIRECT_URI');
    if (ghEnv) return ghEnv;
  }

  // Any provider-specific env set?
  const anyProvider =
    process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI ||
    process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    process.env.REACT_APP_REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    readRuntime('GOOGLE_OAUTH_REDIRECT_URI') ||
    readRuntime('GITHUB_OAUTH_REDIRECT_URI');

  if (anyProvider) {
    return anyProvider;
  }

  // SITE_URL-based fallback
  const site = process.env.REACT_APP_SITE_URL || readRuntime('SITE_URL');
  if (site) {
    return site.endsWith('/') ? `${site}auth/callback` : `${site}/auth/callback`;
  }

  // Final fallback to current origin
  return `${getURL()}auth/callback`;
}

// PUBLIC_INTERFACE
export function getGoogleOAuthConfig() {
  /** Returns Google OAuth config based on env/runtime. */
  const clientId =
    readRuntime('GOOGLE_CLIENT_ID') ||
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    process.env.REACT_APP_REACT_APP_GOOGLE_CLIENT_ID;

  const redirectUri =
    readRuntime('GOOGLE_OAUTH_REDIRECT_URI') ||
    process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI ||
    getRedirectUriForAuthCallback({ preferProvider: 'google' });

  if (process.env.NODE_ENV !== 'production') {
    const missing = [];
    if (!process.env.REACT_APP_SUPABASE_URL) missing.push('REACT_APP_SUPABASE_URL');
    if (!process.env.REACT_APP_SUPABASE_KEY) missing.push('REACT_APP_SUPABASE_KEY');
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
    clientId: clientId || null,
    redirectUri,
  };
}

// PUBLIC_INTERFACE
export function getGitHubOAuthConfig() {
  /** Returns GitHub OAuth config based on env/runtime. */
  const clientId =
    readRuntime('GITHUB_CLIENT_ID') ||
    process.env.REACT_APP_GITHUB_CLIENT_ID ||
    process.env.REACT_APP_REACT_APP_GITHUB_CLIENT_ID;

  const redirectUri =
    readRuntime('GITHUB_OAUTH_REDIRECT_URI') ||
    process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    process.env.REACT_APP_REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    getRedirectUriForAuthCallback({ preferProvider: 'github' });

  if (process.env.NODE_ENV !== 'production') {
    const missing = [];
    if (!clientId) missing.push('REACT_APP_GITHUB_CLIENT_ID');
    if (!redirectUri) missing.push('REACT_APP_GITHUB_OAUTH_REDIRECT_URI');
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
    clientId: clientId || null,
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
