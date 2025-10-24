import React, { useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import getSiteURL from '../../utils/getURL';

/**
 * PUBLIC_INTERFACE
 * GitHubButton:
 * A11y-friendly GitHub OAuth button using Supabase Auth.
 * Initiates supabase.auth.signInWithOAuth with provider 'github'.
 * Button is disabled with a tooltip/message if required configuration is missing.
 */
export default function GitHubButton() {
  const redirectTo = useMemo(() => {
    const envRedirect = process.env.REACT_APP_OAUTH_REDIRECT_URI;
    const base = envRedirect && envRedirect.trim().length > 0 ? envRedirect : `${getSiteURL()}/auth/callback`;
    return base;
  }, []);

  // Guard: Require Supabase env vars. GitHub client id/secret are configured within Supabase dashboard.
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
  const githubConfiguredInDashboard = true; // cannot detect at runtime
  const isConfigOk = Boolean(supabaseUrl && supabaseKey && githubConfiguredInDashboard);

  const disabledReason = !supabaseUrl || !supabaseKey
    ? 'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.'
    : !githubConfiguredInDashboard
      ? 'GitHub provider not enabled in Supabase Dashboard.'
      : '';

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isConfigOk) return;
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('GitHub OAuth start failed:', err);
      alert(err?.message || 'Unable to start GitHub sign-in');
    }
  };

  return (
    <button
      type="button"
      aria-label="Continue with GitHub"
      onClick={handleClick}
      disabled={!isConfigOk}
      title={!isConfigOk ? disabledReason : 'Continue with GitHub'}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#111827',
        color: '#fff',
        border: '1px solid #111827',
        borderRadius: 6,
        cursor: isConfigOk ? 'pointer' : 'not-allowed',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <span aria-hidden="true"></span>
      <span>Continue with GitHub</span>
    </button>
  );
}
