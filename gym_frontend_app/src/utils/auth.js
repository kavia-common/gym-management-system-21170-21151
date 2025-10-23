import { getSupabaseClient } from '../lib/supabaseClient';
import { getRedirectUriForAuthCallback, getGoogleOAuthConfig } from '../config/oauth';

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
 * Use centralized redirect resolver to ensure consistency across the app.
 */
function resolveOAuthRedirect() {
  return getRedirectUriForAuthCallback({ preferProvider: 'google' });
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

  // Normalize and validate provider id
  const normalized = String(provider).toLowerCase().trim();

  // PUBLIC_INTERFACE: Allowed providers when using Supabase on frontend
  const SUPPORTED = new Set(['google', 'github']);

  if (!SUPPORTED.has(normalized)) {
    // Small runtime warning for unknown provider strings
    // eslint-disable-next-line no-console
    console.warn(`[oauth] Unsupported provider "${provider}". Supported providers: google, github.`);
    return { data: null, error: new Error('Unsupported OAuth provider') };
  }

  const redirectTo = resolveOAuthRedirect();
  if (process.env.NODE_ENV !== 'production' && !redirectTo) {
    // eslint-disable-next-line no-console
    console.warn('[oauth] Dev warning: No redirect URI resolved for OAuth. Check REACT_APP_GOOGLE_OAUTH_REDIRECT_URI or REACT_APP_SITE_URL.');
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: normalized, // must be exactly 'google' or 'github'
      options: {
        redirectTo, // ensure this matches src/config/oauth.js resolution
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
          : new Error('Failed to initiate OAuth sign-in. If provider is not enabled in Supabase, please enable it or use email/password.'),
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
  const emailRedirectTo = getRedirectUriForAuthCallback({ preferProvider: 'google' });
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
  // Build reset password redirect using SITE_URL if provided; otherwise default to current origin
  const siteUrl =
    process.env.REACT_APP_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const redirectTo = siteUrl
    ? (siteUrl.endsWith('/') ? `${siteUrl}auth/reset-password` : `${siteUrl}/auth/reset-password`)
    : '/auth/reset-password';

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data, error };
};
