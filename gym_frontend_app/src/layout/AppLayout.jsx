import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
// Design Things Sidebar
import { Sidebar as DTSidebar } from '../design-system/ui';

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
        padding: 0,
        overflow: 'hidden',
        transition: 'padding 0.3s ease',
      }}>
        {sidebarOpen && (
          <DTSidebar
            groups={[
              { label: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', end: true }] },
              { label: 'Memberships', items: [{ to: '/dashboard/memberships', label: 'Plans & Status' }] },
              { label: 'Classes & Trainers', items: [
                { to: '/dashboard/classes', label: 'Classes' },
                { to: '/dashboard/trainers', label: 'Trainers' },
              ] },
              { label: 'Bookings', items: [{ to: '/dashboard/bookings', label: 'My Bookings' }] },
              { label: 'Settings', items: [{ to: '/account', label: 'Account' }] },
            ]}
            style={{ height: '100%' }}
          />
        )}
      </aside>

      {/* Main Content */}
      <main style={{ gridArea: 'content', padding: '24px', background: 'var(--background)', overflowY: 'auto' }}>
        {/* Hamburger button for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-[8px] border border-[var(--dt-primary)] text-[var(--dt-primary)] hover:bg-[var(--dt-primary)]/5"
          style={{ marginBottom: '16px' }}
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
