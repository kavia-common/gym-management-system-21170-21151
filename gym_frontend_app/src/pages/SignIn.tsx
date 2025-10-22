import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import EmailPasswordForm from '../components/auth/EmailPasswordForm.jsx';
import GoogleButton from '../components/auth/GoogleButton.jsx';
import GitHubButton from '../components/auth/GitHubButton.jsx';
import Logo from '../components/branding/Logo.tsx';

/**
 * PUBLIC_INTERFACE
 * SignIn: Email/password login via Supabase, with Google and GitHub OAuth options.
 */
export default function SignIn() {
  const { signIn, role } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [oauthInfo, setOauthInfo] = useState('');
  const from = (location.state as any)?.from?.pathname || null;

  const handleEmailPassword = async (email: string, password: string) => {
    await signIn(email, password);
    const fallback = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
    navigate(from || fallback || '/', { replace: true });
  };

  return (
    <main className="auth-bg">
      <section className="card" role="region" aria-labelledby="signin-title">
        <header className="card-header" style={{ background: 'transparent', boxShadow: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            {/* Default Logo size is 120px as per component; explicit size can be set if needed */}
            <Logo />
          </div>
          <div className="brand" aria-hidden="true" style={{ background: 'transparent', border: 0, boxShadow: 'none', padding: 0, justifyContent: 'center', textAlign: 'center', width: '100%' }}>
            {/* Removed brand-avatar to eliminate any perceived box near the logo */}
            <div className="card-title" id="signin-title">Welcome back</div>
          </div>
        </header>

        <EmailPasswordForm mode="signin" onSubmit={handleEmailPassword} />

        <div className="divider" aria-hidden="true">
          <div className="divider-line" />
          <div className="divider-text">or</div>
          <div className="divider-line" />
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <GoogleButton onError={(m)=>setOauthInfo(m)} />
          <GitHubButton onError={(m)=>setOauthInfo(m)} />
          {oauthInfo ? (
            <div className="helper" role="status" aria-live="polite" style={{ marginTop: 4 }}>
              {oauthInfo}
            </div>
          ) : null}
        </div>

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
