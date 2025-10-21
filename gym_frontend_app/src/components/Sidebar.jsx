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
      </ul>
    </aside>
  );
}
