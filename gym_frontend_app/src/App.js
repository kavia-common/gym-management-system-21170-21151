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

// Supabase auth
import { AuthProvider } from './context';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import Account from './pages/Account.tsx';
import NotAuthorized from './pages/NotAuthorized.jsx';

// Member pages
import MemberDashboard from './pages/Member/MemberDashboard.jsx';
import Schedule from './pages/Member/Schedule.jsx';
import Progress from './pages/Member/Progress.jsx';

// Simple placeholders for upcoming dashboards
function TrainerDashboardPlaceholder() {
  return <div className="card"><h3>Trainer Dashboard</h3><div className="helper">Trainer-only content will appear here.</div></div>;
}

/**
 * PUBLIC_INTERFACE
 * App: Main application entry for routes and layout.
 * - Uses JS ProtectedRoute shim to guard authenticated routes
 * - Demonstrates role-gated routes for member and trainer dashboards
 */
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* Authenticated routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Overview />} />
                <Route path="/dashboard/memberships" element={<Memberships />} />
                <Route path="/dashboard/classes" element={<Classes />} />
                <Route path="/dashboard/trainers" element={<Trainers />} />
                <Route path="/dashboard/bookings" element={<Bookings />} />
                <Route path="/checkout/result" element={<CheckoutResult />} />
                <Route path="/account" element={<Account />} />
              </Route>

              {/* Role-gated routes */}
              <Route element={<ProtectedRoute allowedRoles={['member']} />}>
                <Route path="/dashboard/member" element={<MemberDashboard />} />
                <Route path="/dashboard/member/schedule" element={<Schedule />} />
                <Route path="/dashboard/member/progress" element={<Progress />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
                <Route path="/dashboard/trainer" element={<TrainerDashboardPlaceholder />} />
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
