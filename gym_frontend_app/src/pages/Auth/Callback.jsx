import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Auth callback error:', error);
        navigate('/auth/error', { replace: true });
        return;
      }
      if (data?.session) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/signin', { replace: true });
      }
    };
    handle();
  }, [navigate]);

  return <div className="card"><h3>Processing authentication...</h3></div>;
}
