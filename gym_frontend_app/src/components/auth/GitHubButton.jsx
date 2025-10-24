import React, { useMemo, useState } from 'react';
import { getGitHubOAuthConfig } from '../../config/oauth';

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

  const { clientId, redirectUri } = getGitHubOAuthConfig();

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

  // Toggle a QA outline for click-target debugging
  const qaOutline =
    (typeof window !== 'undefined' &&
      window.__APP_CONFIG__ &&
      window.__APP_CONFIG__.AUTH_DEBUG) ||
    process.env.REACT_APP_AUTH_DEBUG === 'true';

  return (
    <div>
      <button
        className="btn github"
        type="button"
        role="button"
        onClick={handleClick}
        disabled={!!missing.length || pending}
        aria-label="Continue with GitHub"
        aria-describedby={helper ? 'github-info' : undefined}
        title="Continue with GitHub"
        data-testid="github-oauth-button"
        data-authorize-url={authorizeUrl || ''}
        data-qa-outline={qaOutline ? 'true' : 'false'}
        style={{ pointerEvents: 'auto' }}
      >
        <span className="github-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
          >
            <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </span>
        <span style={{ pointerEvents: 'none' }}>
          {pending ? 'Contacting GitHub…' : 'Continue with GitHub'}
        </span>
      </button>
      {helper && (
        <div className="helper" id="github-info" style={{ marginTop: 8 }} role="status" aria-live="polite">
          {helper}
        </div>
      )}
    </div>
  );
}
