import React from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import UserMenu from './UserMenu.tsx';

/**
 * PUBLIC_INTERFACE
 * Navbar: Top navigation bar with brand, environment pill, and auth actions.
 */
export default function Navbar() {
  const { user } = useSupabaseAuth();
  const env = process.env.REACT_APP_APP_ENV || 'dev';

  return (
    <header className="navbar">
      <div className="brand">
        <span style={{ width: 12, height: 12, background: 'var(--primary)', display: 'inline-block', borderRadius: 3 }} />
        <Link to="/dashboard">Gym Manager</Link>
        <span className="helper" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'rgba(30,58,138,0.08)', color: 'var(--primary)', fontSize: 12 }}>
          {env}
        </span>
      </div>
      <div className="actions">
        {user ? (
          <>
            <Link className="btn ghost" to="/account">Account</Link>
            <UserMenu />
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/signin">Sign In</Link>
            <Link className="btn" to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
