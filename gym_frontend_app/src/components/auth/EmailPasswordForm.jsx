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
  const [showPwd, setShowPwd] = useState(false);
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
      <div className="card-header" style={{ textAlign: 'left', marginBottom: 0 }}>
        <div className="card-subtitle" id={`${mode}-helper`}>
          {isSignup
            ? 'Use a strong password to protect your account.'
            : 'Welcome back. Please sign in to continue.'}
        </div>
      </div>

      <div className="input">
        <label htmlFor={`${mode}-email`}>Email</label>
        <div className="input-row">
          <input
            id={`${mode}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            aria-invalid={!!error}
            aria-describedby={`${mode}-helper`}
          />
        </div>
      </div>

      <div className="input">
        <label htmlFor={`${mode}-password`}>Password</label>
        <div className="input-row">
          <input
            id={`${mode}-password`}
            type={showPwd ? 'text' : 'password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            minLength={isSignup ? 6 : undefined}
            placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
            aria-invalid={!!error}
            aria-describedby={`${mode}-helper`}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            onClick={()=>setShowPwd(v=>!v)}
            title={showPwd ? 'Hide password' : 'Show password'}
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        </div>
        {isSignup && !error && (
          <div className="helper">Minimum 6 characters.</div>
        )}
      </div>

      {error && <div className="error-text" role="alert">{error}</div>}

      <button className="btn btn-auth" disabled={submitting} type="submit" aria-live="polite">
        {submitting ? (isSignup ? 'Creating…' : 'Signing in…') : (isSignup ? 'Create account' : 'Sign In')}
      </button>
    </form>
  );
}
