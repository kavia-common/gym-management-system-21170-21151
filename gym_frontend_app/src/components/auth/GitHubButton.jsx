import React from 'react';

/**
 * PUBLIC_INTERFACE
 * GitHubButton (disabled):
 * Social login providers are currently disabled. This component renders nothing.
 *
 * How to re-enable later:
 * 1) Add GitHub OAuth env vars back to .env/.env.example:
 *    - REACT_APP_GITHUB_CLIENT_ID
 *    - REACT_APP_GITHUB_CLIENT_SECRET (if backend uses code exchange)
 *    - REACT_APP_GITHUB_OAUTH_REDIRECT_URI
 * 2) Restore the previous implementation (see git history) or implement
 *    supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } }).
 */
export default function GitHubButton() {
  return null;
}
