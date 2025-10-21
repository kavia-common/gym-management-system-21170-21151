import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NotAuthorized: Friendly page shown when user lacks required role.
 */
export default function NotAuthorized() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  return (
    <div className="content" style={{ maxWidth: 640, margin: '40px auto' }}>
      <section className="card">
        <div className="card-header">
          <div className="card-title">Not authorized</div>
        </div>
        <p className="helper">
          You do not have permission to access this page.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link className="btn" to={from}>Go Back</Link>
          <Link className="btn ghost" to="/dashboard">Go to Dashboard</Link>
        </div>
      </section>
    </div>
  );
}
