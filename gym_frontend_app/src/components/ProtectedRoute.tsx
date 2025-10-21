import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute: Guards children routes and redirects to /signin when not authenticated.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading, ready } = useSupabaseAuth();
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
  return <Outlet />;
}
