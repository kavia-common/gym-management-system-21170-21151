import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../client';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * useMe: Fetches the current user from backend /api/me using Supabase access token.
 * Returns { data, loading, error, refetch, pingProtected }.
 */
export function useMe() {
  const [data, setData] = useState<{ user_id: string; email?: string | null } | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const getBaseUrl = api.getBaseUrl(); // reuse configured API base URL

  const buildUrl = (path: string) =>
    `${getBaseUrl}/../..`.endsWith('/api/v1')
      ? `${getBaseUrl.replace(/\/api\/v1$/, '')}${path}`
      : `${getBaseUrl}${path}`;

  const fetchMe = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetchWithAuth(buildUrl('/api/me'));
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Request failed with ${resp.status}`);
      }
      const json = await resp.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message || 'Failed to load /api/me');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Demo ping to /api/protected to show a success message when logged in
  const pingProtected = async (): Promise<{ ok: boolean; message?: string }> => {
    try {
      const resp = await fetchWithAuth(buildUrl('/api/protected'));
      if (!resp.ok) return { ok: false, message: `HTTP ${resp.status}` };
      const json = await resp.json();
      return { ok: true, message: json?.message || 'ok' };
    } catch (e: any) {
      return { ok: false, message: e?.message || 'request failed' };
    }
  };

  useEffect(() => {
    fetchMe();
    // We intentionally do not include getBaseUrl in deps to avoid loops on hot updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchMe, pingProtected };
}
