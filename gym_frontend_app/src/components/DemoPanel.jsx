import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function DemoPanel() {
  const enabled = (process.env.REACT_APP_DEMO_MODE || '').toString().toLowerCase() === 'true'
    || (typeof window !== 'undefined' && window.__APP_CONFIG__ && String(window.__APP_CONFIG__.DEMO_MODE || '').toLowerCase() === 'true');

  if (!enabled) return null;

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-header">
        <div className="card-title">Demo quick links</div>
        <div className="card-subtitle">Explore the main features</div>
      </div>
      <div className="card-content" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link className="btn ghost" to="/dashboard/classes">Classes</Link>
        <Link className="btn ghost" to="/dashboard/trainers">Trainers</Link>
        <Link className="btn ghost" to="/dashboard/memberships">Memberships</Link>
        <Link className="btn ghost" to="/dashboard/bookings">Bookings</Link>
        <Link className="btn ghost" to="/checkout/result">Payments (mock)</Link>
      </div>
    </div>
  );
}
