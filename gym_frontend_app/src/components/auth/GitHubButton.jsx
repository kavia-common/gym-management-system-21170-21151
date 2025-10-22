import React, { useMemo, useState } from 'react';
import { getURL } from '../../utils/getURL';

/**
 * PUBLIC_INTERFACE
 * GitHubButton: Initiates GitHub OAuth authorization flow when clicked.
 * - Builds the authorize URL from environment variables and navigates the browser.
 * - Uses response_type=code with scopes 'read:user user:email'
 * - Adds basic state parameter for CSRF protection. PKCE: TODO (documented).
 *
 * README:
 * Environment variables required:
 * - REACT_APP_GITHUB_CLIENT_ID
 * - REACT_APP_GITHUB_OAUTH_REDIRECT_URI
 *
 * Optional:
 * - REACT_APP_SITE_URL: used elsewhere to compute URL fallbacks.
 *
 * Behavior:
 * - If required env vars are missing, button is disabled and a helper message is shown.
 * - In demo mode (no backend to exchange the code), /auth/callback will show guidance.
 */
export default function GitHubButton({ onError }) {
  const [info, setInfo] = useState('');
  const [pending, setPending] = useState(false);

  const clientId =
    (typeof window !== 'undefined' &&
      window.__APP_CONFIG__ &&
      window.__APP_CONFIG__.GITHUB_CLIENT_ID) ||
    process.env.REACT_APP_GITHUB_CLIENT_ID;

  const redirectUri =
    (typeof window !== 'undefined' &&
      window.__APP_CONFIG__ &&
      window.__APP_CONFIG__.GITHUB_OAUTH_REDIRECT_URI) ||
    process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
    // Fallback to current origin + /auth/callback if not provided
    `${getURL()}auth/callback`;

  // Prepare state param; include provider hint for callback handler
  const state = useMemo(() => {
    try {
      const salt = Math.random().toString(36).slice(2);
      const ts = Date.now();
      const payload = { provider: 'github', ts, salt };
      return encodeURIComponent(btoa(JSON.stringify(payload)));
    } catch {
      return encodeURIComponent('github');
    }
  }, []);

  const authorizeUrl = useMemo(() => {
    if (!clientId || !redirectUri) return null;
    const base = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'read:user user:email',
      state,
      // PKCE: TODO - generate code_verifier and code_challenge (S256) and store in sessionStorage
      // code_challenge_method: 'S256',
      // code_challenge: '<computed>',
    });
    return `${base}?${params.toString()}`;
  }, [clientId, redirectUri, state]);

  const missing = [];
  if (!clientId) missing.push('REACT_APP_GITHUB_CLIENT_ID');
  // redirectUri fallback always exists via getURL, but encourage explicit config:
  if (!process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI && !(
    typeof window !== 'undefined' &&
    window.__APP_CONFIG__ &&
    window.__APP_CONFIG__.GITHUB_OAUTH_REDIRECT_URI
  )) {
    // not pushing as missing strictly, but we will guide with helper text.
  }

  const handleClick = async () => {
    setInfo('');
    if (!authorizeUrl) {
      const msg = `GitHub OAuth is not configured. Missing: ${missing.join(', ')}`;
      setInfo(msg);
      onError?.(msg);
      return;
    }
    try {
      setPending(true);
      // Navigate to GitHub authorization page
      window.location.assign(authorizeUrl);
    } catch (e) {
      const msg = (e && e.message) || 'Unable to start GitHub sign-in.';
      setInfo(msg);
      onError?.(msg);
      setPending(false);
    }
  };

  const helper = (() => {
    if (missing.length) {
      return `Set ${missing.join(', ')} in your environment and reload the app.`;
    }
    if (!process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI) {
      return 'Using default redirect /auth/callback. Consider setting REACT_APP_GITHUB_OAUTH_REDIRECT_URI.';
    }
    return info;
  })();

  return (
    <div>
      <button
        className="btn github"
        type="button"
        onClick={handleClick}
        disabled={!!missing.length || pending}
        aria-label="Continue with GitHub"
        aria-describedby={helper ? 'github-info' : undefined}
      >
        <span className="github-icon" aria-hidden="true" />
        {pending ? 'Contacting GitHub…' : 'Continue with GitHub'}
      </button>
      {helper && (
        <div className="helper" id="github-info" style={{ marginTop: 8 }} role="status" aria-live="polite">
          {helper}
        </div>
      )}
    </div>
  );
}
