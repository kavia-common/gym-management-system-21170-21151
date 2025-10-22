import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import EmailPasswordForm from '../components/auth/EmailPasswordForm.jsx';
import Logo from '../components/branding/Logo.tsx';

/**
 * PUBLIC_INTERFACE
 * SignUp: Email/password registration via Supabase.
 * Notes: Depending on Supabase settings, user may need to confirm email.
 */
export default function SignUp() {
  const { signUp, role } = useSupabaseAuth();
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleEmailPassword = async (email: string, password: string) => {
    const { session } = await signUp(email, password);
    if (session) {
      const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
      navigate(dest, { replace: true });
    } else {
      setInfo('Check your email to confirm your account, then sign in.');
    }
  };

  return (
    <main className="auth-bg">
      <section className="card" role="region" aria-labelledby="signup-title">
        <header className="card-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Logo size={72} />
          </div>
          <div className="brand" aria-hidden="true">
            <div className="brand-avatar" />
            <div className="card-title" id="signup-title">Create your account</div>
          </div>
          <p className="card-subtitle">Join the gym platform to book classes, track progress, and more.</p>
        </header>

        <EmailPasswordForm mode="signup" onSubmit={handleEmailPassword} />
        {info && <div className="helper" role="status" style={{ marginTop: 8 }}>{info}</div>}

        <footer className="card-footer">
          <p className="helper">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
          <Link className="btn ghost" to="/account" aria-label="Go to Account">Go to Account</Link>
        </footer>
      </section>
    </main>
  );
}
