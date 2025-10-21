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
        <p className="helper" style={{ marginTop: 0 }}>
          You are signed in but your role does not have permission to view this page.
        </p>
        <p className="helper">
          If you believe this is a mistake, contact support or an administrator to update your role.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn" to={from}>Go Back</Link>
          <Link className="btn ghost" to="/dashboard">Go to Dashboard</Link>
          <Link className="btn ghost" to="/account">View Account</Link>
        </div>
      </section>
    </div>
  );
}
