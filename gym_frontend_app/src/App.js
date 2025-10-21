import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Overview from './pages/Dashboard/Overview';
import Memberships from './pages/Dashboard/Memberships';
import Classes from './pages/Dashboard/Classes';
import Trainers from './pages/Dashboard/Trainers';
import Bookings from './pages/Dashboard/Bookings';
import CheckoutResult from './pages/Payments/CheckoutResult';
import { AuthProvider } from './state/authContext';

// PUBLIC_INTERFACE
function App() {
  /**
   * Entry point for the application. Sets up Router, layout (Navbar, Sidebar),
   * and route configuration including protected routes.
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Overview />} />
                <Route path="/dashboard/memberships" element={<Memberships />} />
                <Route path="/dashboard/classes" element={<Classes />} />
                <Route path="/dashboard/trainers" element={<Trainers />} />
                <Route path="/dashboard/bookings" element={<Bookings />} />
                <Route path="/checkout/result" element={<CheckoutResult />} />
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
