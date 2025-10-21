import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute (legacy shim, JS): Supports optional allowedRoles prop for role-gated routes.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, ready, role } = useSupabaseAuth();
  const location = useLocation();

  if (loading || !ready) return <div className="card">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/not-authorized" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
}
