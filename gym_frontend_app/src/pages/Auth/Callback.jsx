import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabaseClient';
import { useSupabaseAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSupabaseAuth();

  useEffect(() => {
    const handle = async () => {
      const supabase = getSupabaseClient();

      try {
        // If Supabase already has a session (e.g., user refreshed callback page), send them on.
        const { data: s0 } = await supabase.auth.getSession();
        if (s0?.session) {
          const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
          navigate(dest, { replace: true });
          return;
        }

        // Supabase v2 supports getSessionFromUrl for OAuth exchange
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
        navigate('/auth/error', { replace: true });
      }
    };

    // Only run on mount or when hash/search changes
    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash, location.search, navigate, role]);

  return <div className="card"><h3>Processing authentication...</h3></div>;
}
