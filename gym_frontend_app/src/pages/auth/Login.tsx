import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleButton from '../../components/auth/GoogleButton.jsx';
import GitHubButton from '../../components/auth/GitHubButton.jsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Email magic link flow via Supabase REST
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMsg(null);
    try {
      // Defer to existing API or context if present; keep minimal to avoid coupling
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then(r => r.json()).catch(() => ({ success: false, message: 'Magic link service unavailable' }));
      if (res?.success) {
        setMsg(res.message || 'Check your email for the magic link.');
      } else {
        setError(res?.message || 'Failed to send magic link.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setSubmitting(false);
    }
  };

  const supabaseConfigured = Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_KEY);

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: 12 }}>Sign in</h2>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Sign in with your email to receive a magic link.{' '}
        <Link to="/">Back to home</Link>
      </p>
      <form onSubmit={onSubmit}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 600 }}>Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px 12px', marginTop: 6, marginBottom: 16, border: '1px solid #d1d5db', borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: '#1E3A8A',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {submitting ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '16px 0', color: '#6b7280' }}>or</div>

      <div style={{ display: 'grid', gap: 8 }}>
        <GoogleButton />
        <GitHubButton />
      </div>

      {!supabaseConfigured && (
        <div style={{ marginTop: 12, color: '#DC2626' }}>
          Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY to enable social sign-in.
        </div>
      )}

      {msg && <div style={{ marginTop: 16, color: '#059669' }}>{msg}</div>}
      {error && <div style={{ marginTop: 16, color: '#DC2626' }}>{error}</div>}
    </div>
  );
};

export default Login;
