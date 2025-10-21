import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// PUBLIC_INTERFACE
export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  /**
   * Renders children if a user session exists; otherwise navigates to /auth/login.
   */
  const { user, loading } = useAuth();

  if (loading) {
    // You could replace with a nicer loader/spinner if present in the project
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
