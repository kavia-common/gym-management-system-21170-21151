import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute (JS shim): Supports optional allowedRoles prop for role-gated routes.
 * - Unauthenticated users are redirected to /signin with the original location in state.
 * - Authenticated but unauthorized (missing role or not in allowedRoles) are redirected
 *   to /not-authorized with a friendly path back to where they came from.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, ready, role } = useSupabaseAuth();
  const location = useLocation();

  // Wait until auth bootstrap completes to avoid flicker and false redirects
  if (loading || !ready) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <div className="card">Loading...</div>
      </div>
    );
  }

  // Not signed in -> go to signin
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Role check (if required)
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const hasRole = !!role;
    const allowed = hasRole && allowedRoles.includes(role);
    if (!allowed) {
      // Friendly unauthorized redirect
      return <Navigate to="/not-authorized" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
}
