import React, { useState } from 'react';
import { useAuth } from '../../state/authContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

/**
 * PUBLIC_INTERFACE
 * Signup page: creates a new account and logs the user in.
 */
export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signup(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <Card title="Create your account">
        <p className="helper" style={{ marginTop: 0 }}>Join Gym Manager to manage your memberships and bookings.</p>
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
          <button className="btn" disabled={submitting} type="submit">
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="helper" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
