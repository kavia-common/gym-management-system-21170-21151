import React from 'react';

/**
 * PUBLIC_INTERFACE
 * GoogleButton (disabled):
 * Social logins are currently disabled. This component renders a small note.
 *
 * How to re-enable later:
 * 1) Add Google provider in Supabase and set env vars back in .env:
 *    - REACT_APP_GOOGLE_CLIENT_ID (if using GIS) and/or
 *    - Configure Supabase provider and rely on REACT_APP_SUPABASE_URL/KEY
 * 2) Restore previous GoogleButton implementation (see git history) to call signInWithGoogle().
 */
export default function GoogleButton() {
  return (
    <div className="helper" style={{ textAlign: 'center', color: 'var(--muted, #6b7280)', padding: 8 }}>
      Social logins are currently disabled.
    </div>
  );
}
