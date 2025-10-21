import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  /**
   * allowedRoles: Optional list of roles that can access the route.
   * If omitted, any authenticated user can access.
   */
  allowedRoles?: string[];
};

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute: Guards children routes and redirects to /signin when not authenticated.
 * Role-aware: If allowedRoles is provided and user's role is not included, redirects to /not-authorized.
 */
export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { allowedRoles } = props;
  const { isAuthenticated, loading, ready, role } = useSupabaseAuth();
  const location = useLocation();

  if (loading || !ready) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    // Only check role after ready === true to avoid flicker
    if (!role || !allowedRoles.includes(role)) {
      // Redirect to friendly page; avoid loops by not using same path
      return <Navigate to="/not-authorized" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;
}
