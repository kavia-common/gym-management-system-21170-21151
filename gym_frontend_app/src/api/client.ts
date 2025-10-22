import { getSupabaseClient } from '../lib/supabaseClient.ts';

/**
 * PUBLIC_INTERFACE
 * fetchWithAuth: Wrapper around fetch that injects Bearer access_token from Supabase (if available).
 * - Captures native fetch once to avoid recursion
 * - Reads current session via supabase.auth.getSession()
 * - Sets Authorization: Bearer <access_token>
 * - On 401 response, attempts supabase.auth.refreshSession() once and retries
 * - If still 401, signs out and redirects to /signin
 * Notes:
 * - We do NOT assign window.fetch to this wrapper; the wrapper is exported and used explicitly.
 * - Includes a simple reentrancy guard to prevent nested wrapping/recursion.
 */
const nativeFetch: typeof window.fetch =
  typeof window !== 'undefined' && typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : (globalThis.fetch as any)?.bind(globalThis) ?? ((...args: any[]) => {
        throw new Error('Fetch API is not available in this environment.');
      });

let isCalling = false;

// PUBLIC_INTERFACE
export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const supabase = getSupabaseClient();

  // Reentrancy guard: if somehow re-entering, fall back to native fetch without auth changes
  if (isCalling) {
    if (process.env.NODE_ENV === 'development') {
      // minimal dev-only log
      // eslint-disable-next-line no-console
      console.debug('[fetchWithAuth] reentrant call detected, delegating directly to native fetch');
    }
    return nativeFetch(input as any, init as any);
  }

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

  isCalling = true;
  try {
    // First attempt using native fetch
    let headers = await buildHeaders();
    let resp = await nativeFetch(input as any, { ...init, headers } as any);

    // If unauthorized, try refresh once
    if (resp.status === 401) {
      try {
        await supabase.auth.refreshSession(); // will update session if refresh token exists
      } catch {
        // ignore; will fall through to sign out
      }
      headers = await buildHeaders();
      resp = await nativeFetch(input as any, { ...init, headers } as any);

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

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[fetchWithAuth] request', input, { status: resp.status });
    }

    return resp;
  } finally {
    isCalling = false;
  }
}
