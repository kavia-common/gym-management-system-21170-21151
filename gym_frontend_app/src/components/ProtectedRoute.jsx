import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute (legacy shim): Wraps protected routes for JS-only consumers.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading, ready } = useSupabaseAuth();
  const location = useLocation();

  if (loading || !ready) return <div className="card">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
