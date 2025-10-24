import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSupabaseAuth } from '../context';
import UserMenu from './UserMenu.tsx';
// Design Things UI
import { Button } from '../design-system/ui';

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

      <nav className="actions" aria-label="Primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Migration: replaced 'btn' classes with Design Things Button */}
        <NavLink to="/overview"><Button variant="ghost" size="sm">Overview</Button></NavLink>
        <NavLink to="/memberships"><Button variant="ghost" size="sm">Memberships</Button></NavLink>
        <NavLink to="/trainers"><Button variant="ghost" size="sm">Trainers</Button></NavLink>
        <NavLink to="/schedule"><Button variant="ghost" size="sm">Schedule</Button></NavLink>
        <NavLink to="/member/home"><Button variant="ghost" size="sm">Member Home</Button></NavLink>
        {ready && isAuthenticated && user ? (
          <>
            <NavLink to="/notifications"><Button variant="ghost" size="sm">Notifications</Button></NavLink>
            <NavLink to="/account"><Button variant="ghost" size="sm">Account</Button></NavLink>
            <UserMenu />
          </>
        ) : (
          <div className="auth-actions" style={{ display: 'flex', gap: 8 }}>
            <Link to="/signin"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/signup"><Button variant="primary" size="sm">Sign Up</Button></Link>
          </div>
        )}
      </nav>
    </header>
  );
}
