import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import UserMenu from './UserMenu.tsx';
import { fetchUnreadCount } from '../api/hooks/useNotifications.ts';
import { Logo } from './branding/index.ts';

/**
 * PUBLIC_INTERFACE
 * Navbar: Top navigation bar with brand, environment pill, notifications bell, and auth actions.
 */
export default function Navbar() {
  const { user, role, ready, isAuthenticated } = useSupabaseAuth();
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
      <div
        className="brand brand--nochrome"
        style={{
          background: 'transparent',
          border: 0,
          boxShadow: 'none',
          padding: 0,
          alignItems: 'center',
          display: 'flex',
          gap: 10
        }}
      >
        {/* Brand logo with no background/border/shadow */}
        <Link
          to="/dashboard"
          className="brand-link"
          aria-label="Gym Manager Home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 0,
            boxShadow: 'none',
            padding: 0,
          }}
        >
          <Logo size={112} className="header-logo-img" />
        </Link>

        {ready && role && (
          <span
            className="helper"
            style={{
              marginLeft: 4,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'rgba(5,150,105,0.08)',
              color: 'var(--success)',
              fontSize: 12
            }}
          >
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
            <div className="auth-actions">
              <Link className="btn btn--outline btn--compact" to="/signin">Sign In</Link>
              <Link className="btn btn--primary btn--compact" to="/signup">Sign Up</Link>
            </div>
          </>
        )}
      </div>

      {/* Inline CSS hardening to ensure no white box around logo */}
      <style>{`
        .navbar .brand,
        .navbar .brand.brand--nochrome,
        .navbar .brand .brand-link,
        .navbar .brand .header-logo-img,
        .navbar .brand img.header-logo-img {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .navbar .brand .brand-link:hover,
        .navbar .brand .brand-link:focus,
        .navbar .brand .brand-link:focus-visible {
          background: transparent !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </header>
  );
}
