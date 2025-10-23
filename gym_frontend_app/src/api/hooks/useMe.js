import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * useMe: Fetches the current user from backend /api/me using Supabase access token.
 * Returns { data, loading, error, refetch, pingProtected }.
 */
export function useMe() {
  const [data, setData] = useState(null); // { user_id: string; email?: string | null }
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();
  const getBaseUrl = api.getBaseUrl(); // reuse configured API base URL

  async function buildHeaders() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  const fetchMe = async () => {
    setLoading(true);
    setError('');
    try {
      // Support both base url styles ending with /api/v1 and plain host
      const url = `${getBaseUrl}/../..`.endsWith('/api/v1')
        ? `${getBaseUrl.replace(/\/api\/v1$/, '')}/api/me`
        : `${getBaseUrl}/api/me`;

      const headers = await buildHeaders();
      const resp = await fetch(url, { headers });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Request failed with ${resp.status}`);
      }
      const json = await resp.json();
      setData(json);
    } catch (e) {
      setError(e?.message || 'Failed to load /api/me');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Demo ping to /api/protected to show a success message when logged in
  const pingProtected = async () => {
    try {
      const url = `${getBaseUrl}/../..`.endsWith('/api/v1')
        ? `${getBaseUrl.replace(/\/api\/v1$/, '')}/api/protected`
        : `${getBaseUrl}/api/protected`;
      const headers = await buildHeaders();
      const resp = await fetch(url, { headers });
      if (!resp.ok) return { ok: false, message: `HTTP ${resp.status}` };
      const json = await resp.json();
      return { ok: true, message: json?.message || 'ok' };
    } catch (e) {
      return { ok: false, message: e?.message || 'request failed' };
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchMe, pingProtected };
}
