import React, { useState } from 'react';
import { useSupabaseAuth } from '../../context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

/**
 * PUBLIC_INTERFACE
 * Login page: authenticates user via email/password only.
 * Social OAuth providers are currently disabled and hidden.
 * To re-enable, restore social button components and add provider env vars.
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

        <div className="helper" style={{ textAlign: 'center', marginTop: 16 }}>
          Social logins are currently disabled.
        </div>

        <p className="helper" style={{ marginTop: 16 }}>
          No account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </Card>
    </div>
  );
}
