import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { useSupabaseAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * AuthCallback:
 * - Handles Supabase OAuth callback (e.g., Google) using getSessionFromUrl.
 * - Also handles GitHub OAuth demo flow. If provider=github (via state or query) and a "code" param exists,
 *   this page will either:
 *   - In demo mode (no backend exchange): navigate to /auth/error with guidance.
 *   - If backend is available in future: exchange code for tokens (TODO: add integration).
 *
 * Notes:
 * - PKCE: If implemented in the future, retrieve code_verifier from sessionStorage for the token request.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSupabaseAuth();

  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const handle = async () => {
      const supabase = getSupabaseClient();

      try {
        // Detect GitHub code flow return
        const code = search.get('code');
        const stateParam = search.get('state');
        const fromState = (() => {
          if (!stateParam) return null;
          try {
            const decoded = JSON.parse(atob(decodeURIComponent(stateParam)));
            return decoded;
          } catch {
            return stateParam;
          }
        })();

        const isGitHub =
          (typeof fromState === 'object' && fromState?.provider === 'github') ||
          String(fromState).toLowerCase().includes('github') ||
          search.get('provider') === 'github';

        if (code && isGitHub) {
          // DEMO MODE: No backend exchange implemented in this repo.
          // Show a friendly message with instructions to configure backend or Supabase custom flow.
          const msg =
            'Returned from GitHub with ?code. Token exchange is not configured in frontend. ' +
            'Please add a backend endpoint to exchange the code for tokens ' +
            '(using REACT_APP_GITHUB_CLIENT_ID/SECRET) and then establish a session. ' +
            'After implementing, redirect back to the app and set auth state.';
          navigate('/auth/error', {
            replace: true,
            state: { message: msg },
          });
          return;
        }

        // If Supabase already has a session (e.g., user refreshed callback page), send them on.
        const { data: s0 } = await supabase.auth.getSession();
        if (s0?.session) {
          const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
          navigate(dest, { replace: true });
          return;
        }

        // Supabase v2 supports getSessionFromUrl for OAuth exchange (e.g., Google)
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth callback error:', error);
          navigate('/auth/error', { replace: true, state: { message: error.message } });
          return;
        }

        if (data?.session) {
          const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
          navigate(dest, { replace: true });
          return;
        }

        // No session after callback -> go to sign-in
        navigate('/signin', { replace: true });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth callback unexpected failure:', e);
        navigate('/auth/error', { replace: true, state: { message: 'Authentication processing failed.' } });
      }
    };

    // Only run on mount or when hash/search changes
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash, location.search, navigate, role, search]);

  return <div className="card"><h3>Processing authentication...</h3></div>;
}
