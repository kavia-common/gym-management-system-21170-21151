import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Overview from './pages/Dashboard/Overview';
import Memberships from './pages/Dashboard/Memberships';
import Classes from './pages/Dashboard/Classes';
import Trainers from './pages/Dashboard/Trainers';
import Bookings from './pages/Dashboard/Bookings';
import CheckoutResult from './pages/Payments/CheckoutResult';
import AuthCallback from './pages/Auth/Callback.jsx';
import Notifications from './pages/Notifications.jsx';

// Supabase auth
import { AuthProvider } from './context';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import Account from './pages/Account.tsx';
import NotAuthorized from './pages/NotAuthorized.jsx';
import { useSupabaseAuth } from './context/AuthContext';

// Member pages
import MemberDashboard from './pages/Member/MemberDashboard.jsx';
import Schedule from './pages/Member/Schedule.jsx';
import Progress from './pages/Member/Progress.jsx';

import TrainerDashboard from './pages/Trainer/TrainerDashboard.jsx';
import TrainerClients from './pages/Trainer/Clients.jsx';
import TrainerTemplates from './pages/Trainer/Workouts/Templates.jsx';
import ProgramBuilder from './pages/Trainer/Workouts/ProgramBuilder.jsx';

/**
 * PUBLIC_INTERFACE
 * App: Main application entry for routes and layout.
 * - Uses JS ProtectedRoute shim to guard authenticated routes
 * - Demonstrates role-gated routes for member and trainer dashboards
 */
function RootRedirect() {
  const { ready, isAuthenticated, role } = useSupabaseAuth();
  if (!ready) {
    return <div className="card">Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  if (role === 'trainer') {
    return <Navigate to="/dashboard/trainer" replace />;
  }
  // default to member
  return <Navigate to="/dashboard/member" replace />;
}

function RoleDashboard() {
  const { role, ready } = useSupabaseAuth();
  if (!ready) return <div className="card">Loading...</div>;
  if (role === 'trainer') return <Navigate to="/dashboard/trainer" replace />;
  return <Navigate to="/dashboard/member" replace />;
}

function App() {
  /**
   * Entry point for the application. Sets up Router, layout (Navbar, Sidebar),
   * and route configuration including protected and role-gated routes.
   */
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <Sidebar />
          <main className="content">
            <Routes>
              {/* Root route: if authenticated, send to role-specific dashboard. Otherwise to /signin */}
              <Route
                path="/"
                element={
                  <RootRedirect />
                }
              />

              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* Authenticated routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<RoleDashboard />} />
                <Route path="/dashboard/memberships" element={<Memberships />} />
                <Route path="/dashboard/classes" element={<Classes />} />
                <Route path="/dashboard/trainers" element={<Trainers />} />
                <Route path="/dashboard/bookings" element={<Bookings />} />
                <Route path="/checkout/result" element={<CheckoutResult />} />
                <Route path="/account" element={<Account />} />
              </Route>

              {/* Notifications: members and trainers */}
              <Route element={<ProtectedRoute allowedRoles={['member', 'trainer']} />}>
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Role-gated routes */}
              {/* Member-only area */}
              <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="/dashboard/member" element={<MemberDashboard />} />
                <Route path="/dashboard/member/schedule" element={<Schedule />} />
                <Route path="/dashboard/member/progress" element={<Progress />} />
              </Route>
              {/* Trainer-only area: all routes below require role 'trainer' */}
              <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
                <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
                <Route path="/dashboard/trainer/clients" element={<TrainerClients />} />
                <Route path="/dashboard/trainer/workouts/templates" element={<TrainerTemplates />} />
                <Route path="/dashboard/trainer/workouts/program-builder" element={<ProgramBuilder />} />
              </Route>

              <Route path="*" element={<div className="card"><h3>Not found</h3></div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
