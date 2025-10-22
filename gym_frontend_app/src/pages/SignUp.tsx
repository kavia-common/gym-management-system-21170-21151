import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../context/AuthContext';
import EmailPasswordForm from '../components/auth/EmailPasswordForm.jsx';

/**
 * PUBLIC_INTERFACE
 * SignUp: Email/password registration via Supabase.
 * Notes: Depending on Supabase settings, user may need to confirm email.
 */
export default function SignUp() {
  const { signUp, role } = useSupabaseAuth();
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleEmailPassword = async (email: string, password: string) => {
    const { session } = await signUp(email, password);
    if (session) {
      const dest = role === 'trainer' ? '/dashboard/trainer' : '/dashboard/member';
      navigate(dest, { replace: true });
    } else {
      setInfo('Check your email to confirm your account, then sign in.');
    }
  };

  return (
    <div className="content" style={{ maxWidth: 520, margin: '40px auto' }}>
      <section className="card" role="region" aria-labelledby="signup-title">
        <div className="card-header">
          <div className="card-title" id="signup-title">Create your account</div>
        </div>

        <EmailPasswordForm mode="signup" onSubmit={handleEmailPassword} />
        {info && <div className="helper" role="status" style={{ marginTop: 8 }}>{info}</div>}

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
