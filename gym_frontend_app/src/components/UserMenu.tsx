import React from 'react';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * UserMenu: Minimal user menu showing email and a Sign out button.
 */
export default function UserMenu() {
  const { user, profile, signOut } = useSupabaseAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirection can be handled by router guards; optionally push to /signin
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.replace('/signin');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed', e);
    }
  };

  if (!user) return null;

  const email = profile?.email || user.email;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span className="helper">Signed in as {email}</span>
      <button className="btn ghost" onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
