import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * AppLayout: Main application layout with responsive top navigation, collapsible sidebar, and content area.
 * Features:
 * - Responsive sidebar that collapses on mobile
 * - Top navigation with branding and user menu
 * - Consistent spacing and Ocean Professional theming
 */
export default function AppLayout({ children }) {
  const { isAuthenticated, ready } = useSupabaseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!ready || !isAuthenticated) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '64px 1fr',
      gridTemplateColumns: sidebarOpen ? '260px 1fr' : '0 1fr',
      gridTemplateAreas: '"navbar navbar" "sidebar content"',
      minHeight: '100vh',
      transition: 'grid-template-columns 0.3s ease',
    }}>
      {/* Top Navigation - handled by existing Navbar */}
      {/* Sidebar */}
      <aside style={{
        gridArea: 'sidebar',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: sidebarOpen ? '16px' : '0',
        overflow: 'hidden',
        transition: 'padding 0.3s ease',
      }}>
        {sidebarOpen && (
          <nav>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Overview
              </div>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                Dashboard
              </NavLink>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Memberships
              </div>
              <NavLink
                to="/dashboard/memberships"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                Plans & Status
              </NavLink>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Classes & Trainers
              </div>
              <NavLink
                to="/dashboard/classes"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                Classes
              </NavLink>
              <NavLink
                to="/dashboard/trainers"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                Trainers
              </NavLink>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Bookings
              </div>
              <NavLink
                to="/dashboard/bookings"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                My Bookings
              </NavLink>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Settings
              </div>
              <NavLink
                to="/account"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px' }}
              >
                Account
              </NavLink>
            </div>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ gridArea: 'content', padding: '24px', background: 'var(--background)', overflowY: 'auto' }}>
        {/* Hamburger button for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn ghost"
          style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          aria-label="Toggle sidebar"
        >
          <span style={{ display: 'inline-block', width: '20px', height: '2px', background: 'currentColor', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-6px', left: 0, width: '20px', height: '2px', background: 'currentColor', display: 'block' }} />
            <span style={{ position: 'absolute', top: '6px', left: 0, width: '20px', height: '2px', background: 'currentColor', display: 'block' }} />
          </span>
          {sidebarOpen ? 'Hide' : 'Show'} Menu
        </button>
        {children}
      </main>
    </div>
  );
}
