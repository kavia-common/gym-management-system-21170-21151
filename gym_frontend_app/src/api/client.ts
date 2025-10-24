import { getSupabaseClient, signOut } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * fetchWithAuth: Wrapper around fetch that injects Bearer access_token from Supabase (if available).
 * Key safety measures:
 *  - baseFetch is captured from the native fetch once and never replaced.
 *  - Token refresh path uses baseFetch, never calls fetchWithAuth to avoid recursion.
 *  - A recursion guard header X-Internal-Request prevents intercepting our own requests.
 *  - Retry is limited to 1 on 401.
 *
 * Usage: import { fetchWithAuth } from 'src/api/client';
 */

// Capture native fetch once. If unavailable, throw meaningful error.
const baseFetch: typeof window.fetch =
  typeof window !== 'undefined' && typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : (globalThis.fetch as any)?.bind(globalThis) ??
      ((..._args: any[]) => {
        throw new Error('Fetch API is not available in this environment.');
      });

// Simple reentrancy flag as a last-resort guard
let isCalling = false;

// Internal header name for recursion guard
const INTERNAL_HEADER = 'X-Internal-Request';

// PUBLIC_INTERFACE
export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const supabase = getSupabaseClient();

  if (isCalling) {
    // Fallback to baseFetch if re-entrant for any reason
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[fetchWithAuth] reentrant call detected, delegating directly to baseFetch');
    }
    return baseFetch(input as any, init as any);
  }

  // If an upstream caller already marked the request as internal, do not modify
  const incomingHeaders = new Headers(init.headers || {});
  if (incomingHeaders.get(INTERNAL_HEADER) === '1') {
    return baseFetch(input as any, init as any);
  }

  // Build auth headers with current access token
  async function buildHeaders(): Promise<Headers> {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const headers = new Headers(init.headers || {});
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    // Mark as internal so we won't re-intercept via other layers
    headers.set(INTERNAL_HEADER, '1');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      headers.delete('Authorization');
    }
    return headers;
  }

  // Perform fetch with current token, optionally after a refresh
  async function doRequest(withRefresh: boolean): Promise<Response> {
    let headers = await buildHeaders();
    let resp = await baseFetch(input as any, { ...init, headers } as any);

    if (resp.status !== 401 || !withRefresh) {
      return resp;
    }

    // Try one refresh cycle using Supabase, ensure we do not call ourselves
    try {
      await supabase.auth.refreshSession();
    } catch {
      // ignore; will sign out on subsequent 401
    }

    headers = await buildHeaders();
    resp = await baseFetch(input as any, { ...init, headers } as any);
    return resp;
  }

  isCalling = true;
  try {
    // First attempt; if 401, allow a single refresh-and-retry
    let response = await doRequest(true);

    if (response.status === 401) {
      // If still unauthorized, sign out and redirect to signin
      try {
        await signOut();
      } catch {
        // ignore sign out failures
      }
      if (typeof window !== 'undefined') {
        const current = window.location.pathname + window.location.search + window.location.hash;
        const redirectTo = `/signin?from=${encodeURIComponent(current)}`;
        if (window.location.pathname !== '/signin') {
          window.location.replace(redirectTo);
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[fetchWithAuth]', { input, status: response.status });
    }
    return response;
  } finally {
    isCalling = false;
  }
}
