import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMsg(null);
    try {
      const res = await signInWithEmail(email);
      if (res.success) {
        setMsg(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    if (!signInWithGoogle) return; // button shouldn't show, but guard.
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    }
  };

  const showGoogle = !!process.env.REACT_APP_GOOGLE_CLIENT_ID;

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

      {showGoogle && (
        <>
          <div style={{ textAlign: 'center', margin: '16px 0', color: '#6b7280' }}>or</div>
          <button
            onClick={onGoogle}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: '#fff',
              color: '#111827',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Continue with Google
          </button>
        </>
      )}

      {msg && <div style={{ marginTop: 16, color: '#059669' }}>{msg}</div>}
      {error && <div style={{ marginTop: 16, color: '#DC2626' }}>{error}</div>}
    </div>
  );
};

export default Login;
