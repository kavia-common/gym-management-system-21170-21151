import { getSiteURL } from '../utils/getURL';

/**
 * PUBLIC_INTERFACE
 * getRedirectUriForAuthCallback: Compute redirect URI for OAuth/email flows.
 * Prefers explicit provider-specific redirect, then SITE_URL/auth/callback.
 */
export function getRedirectUriForAuthCallback({ preferProvider } = {}) {
  const explicit =
    (preferProvider === 'google' && process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI) ||
    (preferProvider === 'github' && process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI) ||
    process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI ||
    process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    process.env.REACT_APP_SITE_URL;

  if (explicit) {
    const base = explicit.endsWith('/') ? explicit.slice(0, -1) : explicit;
    if (base.endsWith('/auth/callback')) return base;
    return `${base}/auth/callback`;
  }

  // Fallback to computed site URL utility (if available) then default to origin
  try {
    const siteUrl = getSiteURL?.();
    if (siteUrl) {
      const norm = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
      return `${norm}/auth/callback`;
    }
  } catch {
    // ignore
  }
  return `${window.location.origin}/auth/callback`;
}

/**
 * PUBLIC_INTERFACE
 * getGitHubOAuthConfig: Returns clientId and redirectUri for GitHub OAuth authorize step.
 */
export function getGitHubOAuthConfig() {
  const clientId =
    process.env.REACT_APP_GITHUB_CLIENT_ID ||
    (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.GITHUB_CLIENT_ID) ||
    '';

  const redirectUri =
    process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.GITHUB_OAUTH_REDIRECT_URI) ||
    getRedirectUriForAuthCallback({ preferProvider: 'github' });

  return { clientId, redirectUri };
}

/**
 * PUBLIC_INTERFACE
 * buildGitHubAuthorizeUrl: Helper to construct the GitHub authorization URL.
 */
export function buildGitHubAuthorizeUrl({ clientId, redirectUri, scope = 'read:user user:email', state }) {
  if (!clientId || !redirectUri) return null;
  const base = 'https://github.com/login/oauth/authorize';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    ...(state ? { state } : {}),
  });
  return `${base}?${params.toString()}`;
}
