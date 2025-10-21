import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Left navigation menu for dashboard sections.
 */
export default function Sidebar() {
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
      </ul>
    </aside>
  );
}
