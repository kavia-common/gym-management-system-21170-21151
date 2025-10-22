import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * AuthError: Displays OAuth/authentication errors with guidance.
 * Provides instructions for both Google (Supabase) and GitHub (frontend-only demo) flows.
 */
export default function AuthError() {
  const location = useLocation();
  const message = (location.state && location.state.message) || 'Authentication failed.';

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card">
        <div className="card-header">
          <div className="card-title">Sign-in Error</div>
        </div>
        <div className="card-body">
          <p className="error-text" style={{ marginBottom: 12 }}>{String(message)}</p>
          <ul className="helper" style={{ marginLeft: 16 }}>
            <li>For Google: ensure Google OAuth is enabled in Supabase Authentication → Providers and /auth/callback is whitelisted.</li>
            <li>For GitHub: set REACT_APP_GITHUB_CLIENT_ID and REACT_APP_GITHUB_OAUTH_REDIRECT_URI, and configure a backend endpoint to exchange the GitHub code for tokens.</li>
            <li>Verify the Redirect URL matches this app&apos;s /auth/callback (or your configured redirect).</li>
            <li>Confirm .env variables are prefixed with REACT_APP_* and the app was restarted after changes.</li>
          </ul>
          <div style={{ marginTop: 16 }}>
            <Link className="btn" to="/signin">Try again</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
