import { getSupabaseClient } from '../lib/supabaseClient.ts';

/**
 * PUBLIC_INTERFACE
 * fetchWithAuth: Wrapper around fetch that injects Bearer access_token from Supabase (if available).
 * - Reads current session via supabase.auth.getSession()
 * - Sets Authorization: Bearer <access_token>
 * - On 401 response, attempts supabase.auth.refreshSession() once and retries
 * - If still 401, signs out and redirects to /signin
 */
export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const supabase = getSupabaseClient();

  async function buildHeaders(): Promise<Headers> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const headers = new Headers(init.headers || {});
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers.delete('Authorization');
    }
    return headers;
  }

  // First attempt
  let headers = await buildHeaders();
  let resp = await fetch(input, { ...init, headers });

  // If unauthorized, try refresh once
  if (resp.status === 401) {
    try {
      await supabase.auth.refreshSession(); // will update session if refresh token exists
    } catch {
      // ignore; will fall through to sign out
    }
    headers = await buildHeaders();
    resp = await fetch(input, { ...init, headers });

    if (resp.status === 401) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      if (typeof window !== 'undefined') {
        // Redirect to signin
        const current = window.location.pathname + window.location.search + window.location.hash;
        const redirectTo = `/signin?from=${encodeURIComponent(current)}`;
        if (window.location.pathname !== '/signin') {
          window.location.replace(redirectTo);
        }
      }
    }
  }

  return resp;
}
