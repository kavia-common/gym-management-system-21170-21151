import React, { useEffect, useRef, useState } from 'react';
import { useSupabaseAuth } from '../../context';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import api from '../../services/apiClient';
import { loadGisScript, initGis, renderGoogleButton, promptOneTap } from '../../services/gis';
import GitHubButton from '../../components/auth/GitHubButton.jsx'; // Ensure full clickable GitHub OAuth button

/**
 * PUBLIC_INTERFACE
 * Login page: authenticates user, stores tokens, and redirects.
 * Also supports Google Sign-In via Google Identity Services (button + One Tap).
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

  // Google button container ref
  const googleBtnRef = useRef(null);
  // Prefer runtime config, else fallback to .env
  const GOOGLE_CLIENT_ID =
    (typeof window !== "undefined" && window.__APP_CONFIG__ && window.__APP_CONFIG__.GOOGLE_CLIENT_ID) ||
    process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Callback invoked by GIS when credential is received
  const handleGoogleCredential = async (response) => {
    const credential = response?.credential;
    if (!credential) return;

    setSubmitting(true);
    setError('');
    try {
      // Send ID token to backend to exchange for app JWTs
      const tokens = await api.post('/auth/google/one-tap', { credential });
      // Store tokens via auth context by reusing the login flow:
      // authContext expects setTokens via login/signup routes; we can set directly by hitting refresh endpoint pattern,
      // but simplest is to emulate by storing via a small helper endpoint response (already in tokens).
      // We don't have a direct setter exposed, but login flow returns tokens and sets into context.
      // Instead of calling login (which needs email/password), we'll use a custom event route:
      // Since AuthProvider updates api tokens from storage, we can set localStorage and trigger a reload path.
      // However, to stay within current public interfaces, we can call a light helper pattern:
      // We'll patch tokens into api client then navigate. The profile fetch will happen automatically due to AuthProvider effect.
      try {
        // Persist tokens for AuthProvider effect to pick up
        localStorage.setItem('gym.tokens', JSON.stringify(tokens));
      } catch { /* ignore storage errors */ }
      // As api client attaches tokens from context, we also set them temporarily so current session requests are authed
      api.setAuthTokens(tokens);
      // Navigate to destination; AuthProvider effect (on mount) will read tokens and fetch /auth/me
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Google sign-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const setupGis = async () => {
      if (!GOOGLE_CLIENT_ID) {
        // If not configured, do nothing; button won't show
        return;
      }
      try {
        await loadGisScript();
        if (!mounted) return;

        const ok = initGis(GOOGLE_CLIENT_ID, handleGoogleCredential);
        if (!ok) return;

        // Render the "Continue with Google" button
        if (googleBtnRef.current) {
          renderGoogleButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 360
          });
        }

        // Optionally show One Tap (non-blocking; respects Google heuristics)
        promptOneTap();
      } catch {
        // swallow errors; user can use email/password fallback
      }
    };

    setupGis();

    return () => {
      mounted = false;
    };
  }, [GOOGLE_CLIENT_ID]); // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Divider */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div className="helper">or</div>
          <div style={{ height: 1, background: 'var(--border)' }} />
        </div>

        {/* Google Sign-In button container */}
        {GOOGLE_CLIENT_ID ? (
          <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }} />
        ) : (
          <div className="helper" style={{ textAlign: 'center', color: "var(--error)" }}>
            Google Sign-In is not configured.<br />
            Please set <b>GOOGLE_CLIENT_ID</b> in <span style={{ fontFamily: "mono" }}>public/app-config.json</span><br />
            or <b>REACT_APP_GOOGLE_CLIENT_ID</b> in your <span style={{ fontFamily: "mono" }}>.env</span> file and reload the app.
          </div>
        )}

        {/* Divider */}
        <div className="divider" style={{ marginTop: 16 }}>
          <div className="divider-line" />
          <div className="divider-text">or</div>
          <div className="divider-line" />
        </div>

        {/* GitHub Sign-In button */}
        <GitHubButton onError={(msg) => console.warn('GitHub OAuth error:', msg)} />

        <p className="helper" style={{ marginTop: 16 }}>
          No account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </Card>
    </div>
  );
}
