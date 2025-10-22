import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import UserMenu from './UserMenu.tsx';

/**
 * PUBLIC_INTERFACE
 * Navbar: Simple top navigation with brand text and auth actions.
 * Restored to previous minimal implementation without custom Logo component or inline overrides.
 */
export default function Navbar() {
  const { user, ready, isAuthenticated } = useSupabaseAuth();

  return (
    <header className="navbar">
      <div className="brand">
        <Link to="/dashboard" aria-label="Gym Manager Home" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Gym Manager</span>
        </Link>
      </div>

      <nav className="actions" aria-label="Primary">
        {ready && isAuthenticated && user ? (
          <>
            <NavLink className="btn ghost" to="/notifications">Notifications</NavLink>
            <NavLink className="btn ghost" to="/account">Account</NavLink>
            <UserMenu />
          </>
        ) : (
          <div className="auth-actions">
            <Link className="btn btn--outline btn--compact" to="/signin">Sign In</Link>
            <Link className="btn btn--primary btn--compact" to="/signup">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
