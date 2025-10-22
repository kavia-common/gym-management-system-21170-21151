import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import UserMenu from './UserMenu.tsx';
import { fetchUnreadCount } from '../api/hooks/useNotifications.ts';

/**
 * PUBLIC_INTERFACE
 * Navbar: Top navigation bar with brand, environment pill, notifications bell, and auth actions.
 */
export default function Navbar() {
  const { user, role, ready, isAuthenticated } = useSupabaseAuth();
  // Removed environment badge to avoid showing 'dev' or 'beta' labels in UI
  const env = undefined;
  const [unread, setUnread] = useState(0);

  // Poll unread count every 30 seconds when authenticated
  useEffect(() => {
    let timer;
    let cancelled = false;

    const load = async () => {
      if (!isAuthenticated) {
        setUnread(0);
        return;
      }
      const c = await fetchUnreadCount();
      if (!cancelled) setUnread(c);
    };

    load();
    if (isAuthenticated) {
      timer = setInterval(load, 30000);
    }

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [isAuthenticated]);

  return (
    <header className="navbar">
      <div className="brand">
        <span style={{ width: 12, height: 12, background: 'var(--primary)', display: 'inline-block', borderRadius: 3 }} />
        <Link to="/dashboard">Gym Manager</Link>
        
        {ready && role && (
          <span className="helper" style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 999, background: 'rgba(5,150,105,0.08)', color: 'var(--success)', fontSize: 12 }}>
            {role}
          </span>
        )}
      </div>
      <div className="actions">
        {user ? (
          <>
            {/* Notifications bell */}
            <Link className="btn ghost" to="/notifications" aria-label="Notifications" title="Notifications" style={{ position: 'relative' }}>
              {/* Simple bell icon using CSS */}
              <span style={{
                display: 'inline-block',
                width: 18,
                height: 18,
                borderRadius: '2px 2px 8px 8px',
                border: '2px solid var(--primary)',
                position: 'relative'
              }} />
              {unread > 0 && (
                <span
                  aria-label={`${unread} unread notifications`}
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'var(--error)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '0 6px',
                    fontSize: 11,
                    lineHeight: '18px',
                    height: 18,
                    minWidth: 18,
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
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
