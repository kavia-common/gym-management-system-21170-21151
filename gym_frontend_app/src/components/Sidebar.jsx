import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Left navigation menu for dashboard sections.
 * Renders only for authenticated users to avoid showing app nav when logged out.
 */
export default function Sidebar() {
  const { isAuthenticated, ready } = useSupabaseAuth();
  if (!ready || !isAuthenticated) {
    return null;
  }
  return (
    <aside className="sidebar">
      <ul className="menu">
        <li>
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>Overview</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/memberships" className={({ isActive }) => isActive ? 'active' : ''}>Memberships</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/classes" className={({ isActive }) => isActive ? 'active' : ''}>Classes</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/trainers" className={({ isActive }) => isActive ? 'active' : ''}>Trainers</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/bookings" className={({ isActive }) => isActive ? 'active' : ''}>Bookings</NavLink>
        </li>
        <li style={{ marginTop: 12 }}>
          <span className="helper" style={{ padding: '2px 8px', display: 'inline-block' }}>Member</span>
        </li>
        <li>
          <NavLink to="/dashboard/member" className={({ isActive }) => isActive ? 'active' : ''}>Member Home</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/member/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink>
        </li>
        <li style={{ marginTop: 12 }}>
          <span className="helper" style={{ padding: '2px 8px', display: 'inline-block' }}>Trainer</span>
        </li>
        <li>
          <NavLink to="/dashboard/trainer" className={({ isActive }) => isActive ? 'active' : ''}>Trainer Home</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/trainer/clients" className={({ isActive }) => isActive ? 'active' : ''}>Clients</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/trainer/workouts/templates" className={({ isActive }) => isActive ? 'active' : ''}>Workouts / Templates</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/trainer/workouts/program-builder" className={({ isActive }) => isActive ? 'active' : ''}>Program Builder</NavLink>
        </li>
      </ul>
    </aside>
  );
}
