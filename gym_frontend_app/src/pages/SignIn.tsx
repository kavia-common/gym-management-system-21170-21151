import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * SignIn: Email/password login via Supabase.
 */
export default function SignIn() {
  const { signIn } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card">
        <div className="card-header">
          <div className="card-title">Sign in</div>
        </div>
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
        <p className="helper" style={{ marginTop: 16 }}>
          No account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </section>
    </div>
  );
}
