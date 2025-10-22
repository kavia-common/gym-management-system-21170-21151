import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * EmailPasswordForm: Reusable form for email/password auth.
 * Props:
 *  - mode: 'signin' | 'signup'
 *  - onSubmit: (email: string, password: string) => Promise<void>
 */
export default function EmailPasswordForm({ mode = 'signin', onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (!email || !password) {
        throw new Error('Please enter email and password.');
      }
      if (isSignup && password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
      await onSubmit(email, password);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} aria-busy={submitting}>
      <div className="input">
        <label htmlFor={`${mode}-email`}>Email</label>
        <input
          id={`${mode}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          aria-invalid={!!error}
        />
      </div>
      <div className="input">
        <label htmlFor={`${mode}-password`}>Password</label>
        <input
          id={`${mode}-password`}
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          minLength={isSignup ? 6 : undefined}
          placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
          aria-invalid={!!error}
        />
      </div>
      {error && <div className="error-text" role="alert">{error}</div>}
      <button className="btn" disabled={submitting} type="submit" aria-live="polite">
        {submitting ? (isSignup ? 'Creating…' : 'Signing in…') : (isSignup ? 'Create account' : 'Sign In')}
      </button>
    </form>
  );
}
