import React from 'react';
import { useAuth } from '../state/authContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Navbar: Top navigation bar with brand, environment pill, and auth actions.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const env = process.env.REACT_APP_APP_ENV || 'dev';

  const handleLogout = () => {
    logout();
    // If user logs out while on a protected route, redirect to login
    if (location.pathname.startsWith('/dashboard')) {
      navigate('/login');
    }
  };

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
            <span className="helper">Signed in as {user.email}</span>
            <button className="btn ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn ghost" to="/login">Login</Link>
            <Link className="btn" to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
