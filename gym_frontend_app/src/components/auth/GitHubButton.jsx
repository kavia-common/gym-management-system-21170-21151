import React, { useMemo, useState, useCallback } from 'react';
import { getGitHubOAuthConfig } from '../../config/oauth';
import { getSupabaseClient } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * GitHubButton: Accessible, fully clickable button to initiate GitHub OAuth sign-in.
 * - Uses Supabase OAuth when available, falling back to direct authorize URL.
 * - Ensures semantics, keyboard accessibility, and visible focus/hover.
 *
 * Env variables:
 * - REACT_APP_GITHUB_CLIENT_ID (for direct authorize URL fallback)
 * - REACT_APP_GITHUB_OAUTH_REDIRECT_URI (optional; fallback computed to /auth/callback)
 * - REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY (for Supabase client)
 */
export default function GitHubButton({ onError }) {
  const [info, setInfo] = useState('');
  const [pending, setPending] = useState(false);

  const { clientId, redirectUri } = getGitHubOAuthConfig();
  const supabase = getSupabaseClient();

  // State param for CSRF protection and provider hint
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
    });
    return `${base}?${params.toString()}`;
  }, [clientId, redirectUri, state]);

  const missing = [];
  if (!clientId) missing.push('REACT_APP_GITHUB_CLIENT_ID');

  const startOAuth = useCallback(async () => {
    // Prefer Supabase OAuth if client is available
    try {
      setPending(true);
      setInfo('');
      if (supabase?.auth?.signInWithOAuth) {
        await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo:
              process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URI ||
              (typeof window !== 'undefined'
                ? `${window.location.origin}/auth/callback`
                : undefined),
          },
        });
        return; // Supabase will redirect; no further code runs.
      }
      // Fallback: direct authorize URL
      if (!authorizeUrl) {
        const msg = `GitHub OAuth is not configured. Missing: ${missing.join(', ')}`;
        setInfo(msg);
        onError?.(msg);
        setPending(false);
        return;
      }
      window.location.assign(authorizeUrl);
    } catch (e) {
      const msg = (e && e.message) || 'Unable to start GitHub sign-in.';
      setInfo(msg);
      onError?.(msg);
      setPending(false);
    }
  }, [authorizeUrl, missing, onError, supabase]);

  const onKeyDown = (e) => {
    // Ensure Space triggers click in addition to Enter (for robustness across roles)
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      e.currentTarget.click();
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
        onClick={startOAuth}
        onKeyDown={onKeyDown}
        disabled={pending}
        aria-label="Continue with GitHub"
        aria-describedby={helper ? 'github-info' : undefined}
        title="Continue with GitHub"
        data-testid="github-oauth-button"
        data-authorize-url={authorizeUrl || ''}
        data-qa-outline={qaOutline ? 'true' : 'false'}
        style={{ pointerEvents: 'auto' }}
      >
        <span className="github-icon" aria-hidden="true" />
        <span aria-hidden="false">
          {pending ? 'Contacting GitHub…' : 'Continue with GitHub'}
        </span>
      </button>
      {helper && (
        <div
          className="helper"
          id="github-info"
          style={{ marginTop: 8 }}
          role="status"
          aria-live="polite"
        >
          {helper}
        </div>
      )}
    </div>
  );
}
