import { getSupabaseClient } from '../lib/supabaseClient.ts';
import { getURL } from './getURL';

/**
 * README (OAuth env):
 * Required for GitHub button:
 *  - REACT_APP_GITHUB_CLIENT_ID
 *  - REACT_APP_GITHUB_OAUTH_REDIRECT_URI  (e.g., https://your-app.com/auth/callback)
 * Optional:
 *  - REACT_APP_SITE_URL  (used for email redirect and general callback resolution)
 *
 * Google/Supabase still use:
 *  - REACT_APP_SUPABASE_URL
 *  - REACT_APP_SUPABASE_KEY
 *  - REACT_APP_GOOGLE_OAUTH_REDIRECT_URI (optional, else SITE_URL or current origin)
 */

/**
 * Resolve the redirect URL for OAuth callbacks.
 * Order of precedence:
 * 1. Explicit REACT_APP_GOOGLE_OAUTH_REDIRECT_URI
 * 2. SITE_URL (if provided by runtime)
 * 3. window.location.origin + /auth/callback
 */
function resolveOAuthRedirect() {
  const explicit = process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI;
  if (explicit && typeof explicit === 'string') return explicit;

  const siteUrl = process.env.REACT_APP_SITE_URL;
  if (siteUrl && typeof siteUrl === 'string') {
    return siteUrl.endsWith('/') ? `${siteUrl}auth/callback` : `${siteUrl}/auth/callback`;
  }

  // Fall back to current origin
  return `${getURL()}auth/callback`;
}

/**
 * PUBLIC_INTERFACE
 * signInWithOAuth: Generic OAuth sign-in using Supabase.
 * Validates provider and returns friendly error messages on misconfiguration.
 */
export const signInWithOAuth = async (provider) => {
  if (!provider) {
    return { data: null, error: new Error('No OAuth provider specified') };
  }

  const redirectTo = resolveOAuthRedirect();

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        // Optional: force redirect flow for web apps
        queryParams: {
          // hd: could be set for workspace restriction if needed
        },
      },
    });
    return { data, error };
  } catch (e) {
    return {
      data: null,
      error:
        e instanceof Error
          ? e
          : new Error('Failed to initiate OAuth sign-in. If Google is not enabled in Supabase, please enable it or use email/password.'),
    };
  }
};

/**
 * PUBLIC_INTERFACE
 * signInWithGoogle: Convenience wrapper to sign in with Google.
 */
export const signInWithGoogle = async () => {
  // Helpful runtime validation for common misconfigurations
  const missing = [];
  if (!process.env.REACT_APP_SUPABASE_URL) missing.push('REACT_APP_SUPABASE_URL');
  if (!process.env.REACT_APP_SUPABASE_KEY) missing.push('REACT_APP_SUPABASE_KEY');
  // Optional but recommended:
  // REACT_APP_GOOGLE_OAUTH_REDIRECT_URI should match your deployed /auth/callback
  // Not strictly required if SITE_URL is set or getURL() is correct.
  if (missing.length) {
    return {
      data: null,
      error: new Error(
        `Missing required environment variables: ${missing.join(
          ', '
        )}. Please configure your .env and restart the app.`
      ),
    };
  }
  return signInWithOAuth('google');
};

/**
 * PUBLIC_INTERFACE
 * signUp: Email/password signup via Supabase.
 */
export const signUp = async (email, password) => {
  const supabase = getSupabaseClient();
  const siteUrl =
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : undefined);
  const emailRedirectTo = siteUrl
    ? (siteUrl.endsWith('/') ? `${siteUrl}auth/callback` : `${siteUrl}/auth/callback`)
    : `${getURL()}auth/callback`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });
  return { data, error };
};

/**
 * PUBLIC_INTERFACE
 * resetPassword: Sends a reset password email using Supabase.
 */
export const resetPassword = async (email) => {
  const supabase = getSupabaseClient();
  const siteUrl =
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : undefined);
  const redirectTo = siteUrl
    ? (siteUrl.endsWith('/') ? `${siteUrl}auth/reset-password` : `${siteUrl}/auth/reset-password`)
    : `${getURL()}auth/reset-password`;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data, error };
};
