import { buildGitHubAuthorizeUrl as buildFromConfig } from '../config/oauth';

/**
 * PUBLIC_INTERFACE
 * buildGitHubAuthorizeUrl: Constructs GitHub OAuth authorize URL using centralized config.
 */
export function buildGitHubAuthorizeUrl({ clientId, redirectUri, scope = 'read:user user:email', state }) {
  return buildFromConfig({ clientId, redirectUri, scope, state });
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
