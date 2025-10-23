import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { useSupabaseAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * AuthCallback:
 * - Handles Supabase OAuth callback (e.g., Google) using getSessionFromUrl.
 * - Handles GitHub OAuth callback by detecting provider via state/query; if code present but no backend,
 *   navigates to /auth/error with guidance.
 * On success: routes to role-based dashboard. On failure: routes to /auth/error.
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
        const providerHint = search.get('provider');
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
          providerHint === 'github' ||
          (typeof fromState === 'object' && fromState?.provider === 'github') ||
          String(fromState || '').toLowerCase().includes('github');

        if (code && isGitHub) {
          const msg =
            'Returned from GitHub with code. A backend token exchange is required and is not configured in this app. ' +
            'Please implement a backend endpoint to exchange the code for tokens and establish a session.';
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

        // Handle Supabase OAuth (e.g., Google)
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

        // No session -> go to sign-in
        navigate('/signin', { replace: true });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth callback unexpected failure:', e);
        navigate('/auth/error', { replace: true, state: { message: 'Authentication processing failed.' } });
      }
    };

    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash, location.search, navigate, role, search]);

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card">
        <div className="card-header">
          <div className="card-title">Processing authentication...</div>
        </div>
        <div className="card-body">
          <p className="helper" style={{ marginBottom: 8 }}>
            If you landed here accidentally, please use your email and password to sign in.
          </p>
          <p>
            <a className="btn" href="/signin">Go to Sign In</a>
          </p>
        </div>
      </section>
    </div>
  );
}
