import React, { useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import getSiteURL from '../../utils/getURL';

/**
 * PUBLIC_INTERFACE
 * GoogleButton:
 * A11y-friendly Google OAuth button using Supabase Auth.
 * Initiates supabase.auth.signInWithOAuth with provider 'google'.
 * Button is disabled with a tooltip/message if required configuration is missing.
 */
export default function GoogleButton() {
  const redirectTo = useMemo(() => {
    const envRedirect = process.env.REACT_APP_OAUTH_REDIRECT_URI;
    const base = envRedirect && envRedirect.trim().length > 0 ? envRedirect : `${getSiteURL()}/auth/callback`;
    return base;
  }, []);

  // Guard: Require Supabase env vars. Google-specific client id is not required by supabase-js on the frontend.
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
  const googleConfiguredInDashboard = true; // cannot detect at runtime; assume true and rely on Supabase error if not
  const isConfigOk = Boolean(supabaseUrl && supabaseKey && googleConfiguredInDashboard);

  const disabledReason = !supabaseUrl || !supabaseKey
    ? 'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.'
    : !googleConfiguredInDashboard
      ? 'Google provider not enabled in Supabase Dashboard.'
      : '';

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isConfigOk) return;
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Google OAuth start failed:', err);
      alert(err?.message || 'Unable to start Google sign-in');
    }
  };

  return (
    <button
      type="button"
      aria-label="Continue with Google"
      onClick={handleClick}
      disabled={!isConfigOk}
      title={!isConfigOk ? disabledReason : 'Continue with Google'}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: '#fff',
        color: '#111827',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        cursor: isConfigOk ? 'pointer' : 'not-allowed',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <span aria-hidden="true">🔵</span>
      <span>Continue with Google</span>
    </button>
  );
}
