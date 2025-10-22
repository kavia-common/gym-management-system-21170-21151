import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import EmailPasswordForm from '../components/auth/EmailPasswordForm.jsx';
import Logo from '../components/branding/Logo.tsx';

/**
 * PUBLIC_INTERFACE
 * SignIn: Email/password login via Supabase.
 */
export default function SignIn() {
  const { signIn, role } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || null;

  const handleEmailPassword = async (email: string, password: string) => {
    await signIn(email, password);
    const fallback = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
    navigate(from || fallback || '/', { replace: true });
  };

  return (
    <main className="auth-bg">
      <section className="card" role="region" aria-labelledby="signin-title">
        <header className="card-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            {/* Default Logo size is 120px as per component; explicit size can be set if needed */}
            <Logo />
          </div>
          <div className="brand" aria-hidden="true">
            <div className="brand-avatar" />
            <div className="card-title" id="signin-title">Welcome back</div>
          </div>
          <p className="card-subtitle">Use email and password to sign in.</p>
        </header>

        <div className="helper" role="note" aria-live="polite" style={{ marginBottom: 8 }}>
          Use email and password to sign in.
        </div>

        <EmailPasswordForm mode="signin" onSubmit={handleEmailPassword} />

        <footer className="card-footer" style={{ marginTop: 10 }}>
          <p className="helper">
            No account? <Link to="/signup">Create one</Link>
          </p>
          <Link className="btn ghost" to="/account" aria-label="Go to Account">Go to Account</Link>
        </footer>
      </section>
    </main>
  );
}
