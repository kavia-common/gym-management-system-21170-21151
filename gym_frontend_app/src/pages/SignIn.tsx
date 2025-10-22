import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import EmailPasswordForm from '../components/auth/EmailPasswordForm.jsx';
import GoogleButton from '../components/auth/GoogleButton.jsx';

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
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card" role="region" aria-labelledby="signin-title">
        <div className="card-header">
          <div className="card-title" id="signin-title">Sign in</div>
        </div>

        <EmailPasswordForm mode="signin" onSubmit={handleEmailPassword} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div className="helper">or</div>
          <div style={{ height: 1, background: 'var(--border)' }} />
        </div>

        <GoogleButton />

        <p className="helper" style={{ marginTop: 16 }}>
          No account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
        <div style={{ marginTop: 8 }}>
          <Link className="btn ghost" to="/account">Go to Account</Link>
        </div>
      </section>
    </div>
  );
}
