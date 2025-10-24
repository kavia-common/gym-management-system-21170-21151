import React, { useState } from 'react';
import { useSupabaseAuth } from '../../context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import GoogleButton from '../../components/auth/GoogleButton.jsx';
import GitHubButton from '../../components/auth/GitHubButton.jsx';

/**
 * PUBLIC_INTERFACE
 * Login page supporting email/password and social OAuth (Google/GitHub) via Supabase.
 * Buttons include runtime guards and remain disabled if env is missing.
 */
export default function Login() {
  const { signIn } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const supabaseConfigured = Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_KEY);

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <Card title="Welcome back">
        <p className="helper" style={{ marginTop: 0 }}>Sign in to access your dashboard.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn" disabled={submitting} type="submit">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="helper" style={{ textAlign: 'center', margin: '16px 0' }}>or</div>

        <div style={{ display: 'grid', gap: 8 }}>
          <GoogleButton />
          <GitHubButton />
        </div>

        {!supabaseConfigured && (
          <div className="error-text" style={{ marginTop: 12 }}>
            Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY to enable social sign-in.
          </div>
        )}

        <p className="helper" style={{ marginTop: 16 }}>
          No account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </Card>
    </div>
  );
}
