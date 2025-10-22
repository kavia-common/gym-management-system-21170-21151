 /**
  * PUBLIC_INTERFACE
  * buildGitHubAuthorizeUrl: Constructs GitHub OAuth authorize URL.
  */
export function buildGitHubAuthorizeUrl({ clientId, redirectUri, scope = 'read:user user:email', state }) {
  if (!clientId) throw new Error('Missing GitHub clientId');
  if (!redirectUri) throw new Error('Missing GitHub redirectUri');
  const base = 'https://github.com/login/oauth/authorize';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
  });
  if (state) params.set('state', state);
  return `${base}?${params.toString()}`;
}

/**
 * PUBLIC_INTERFACE
 * exchangeGitHubCodeForTokens: Placeholder for backend integration.
 * Provide an implementation that POSTs the { code, state, code_verifier? } to your backend.
 * TODO: integrate when backend endpoint is available.
 */
export async function exchangeGitHubCodeForTokens(_code, _options = {}) {
  // Example outline:
  // const resp = await fetch('/api/auth/github/callback', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ code, code_verifier, redirect_uri }),
  // });
  // if (!resp.ok) throw new Error(await resp.text());
  // return resp.json();
  throw new Error('GitHub token exchange is not implemented. Configure a backend endpoint to exchange code for tokens.');
}
