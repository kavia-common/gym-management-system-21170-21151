import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * SignUp: Email/password registration via Supabase.
 * Notes: Depending on Supabase settings, user may need to confirm email.
 */
export default function SignUp() {
  const { signUp, role } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setInfo('');
    try {
      const { user, session } = await signUp(email, password);
      if (session) {
        // Signed in immediately (if email confirmation disabled)
        const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
        navigate(dest, { replace: true });
      } else {
        setInfo('Check your email to confirm your account, then sign in.');
      }
    } catch (err: any) {
      setError(err?.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card">
        <div className="card-header">
          <div className="card-title">Create your account</div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
          </div>
          {error && <div className="error-text">{error}</div>}
          {info && <div className="helper">{info}</div>}
          <button className="btn" disabled={submitting} type="submit">
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="helper" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/signin" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
        <div style={{ marginTop: 8 }}>
          <Link className="btn ghost" to="/account">Go to Account</Link>
        </div>
      </section>
    </div>
  );
}
