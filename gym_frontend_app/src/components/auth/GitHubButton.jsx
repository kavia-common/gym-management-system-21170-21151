import React, { useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * GitHubButton - Triggers Supabase OAuth flow with GitHub.
 * Automatically selects redirectTo based on current origin (localhost vs prod).
 */
export default function GitHubButton() {
  const redirectTo = useMemo(() => {
    const origin = window.location.origin;
    const chosen =
      origin.includes('localhost')
        ? process.env.REACT_APP_OAUTH_REDIRECT_URI_LOCAL
        : process.env.REACT_APP_OAUTH_REDIRECT_URI_PROD;
    return chosen || '';
  }, []);

  // Guard: require core envs to enable button
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
  const isConfigOk =
    Boolean(supabaseUrl && supabaseKey) &&
    Boolean(process.env.REACT_APP_OAUTH_REDIRECT_URI_LOCAL) &&
    Boolean(process.env.REACT_APP_OAUTH_REDIRECT_URI_PROD);

  const disabledReason =
    !supabaseUrl || !supabaseKey
      ? 'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.'
      : !process.env.REACT_APP_OAUTH_REDIRECT_URI_LOCAL || !process.env.REACT_APP_OAUTH_REDIRECT_URI_PROD
        ? 'OAuth redirect URIs are not set.'
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
      console.error('GitHub sign-in error:', err);
      alert(err?.message || 'Unable to start GitHub sign-in');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isConfigOk}
      className={`w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${!isConfigOk ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-disabled={!isConfigOk}
      aria-label="Sign in with GitHub"
      title={!isConfigOk ? disabledReason : 'Continue with GitHub'}
    >
      <span className="sr-only">Sign in with GitHub</span>
      Continue with GitHub
    </button>
  );
}
