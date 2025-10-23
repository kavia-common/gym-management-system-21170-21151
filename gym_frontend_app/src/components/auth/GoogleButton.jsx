import React, { useState } from 'react';
import { signInWithGoogle } from '../../utils/auth';

/**
 * PUBLIC_INTERFACE
 * GoogleButton: Initiates Supabase Google OAuth sign-in when clicked.
 * - If provider is not enabled or unsupported, shows a friendly inline message instead of crashing.
 * - Optional prop onError(message) to surface a custom toast in parent if desired.
 */
export default function GoogleButton({ onError }) {
  const [info, setInfo] = useState('');
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setInfo('');
    setPending(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        const msg = normalizeError(error);
        setInfo(msg);
        onError?.(msg);
      } else {
        // Supabase will redirect for OAuth; keep UI responsive until navigation
      }
    } catch (e) {
      const msg = normalizeError(e);
      setInfo(msg);
      onError?.(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <button
        className="btn google"
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label="Continue with Google"
        aria-describedby={info ? 'google-info' : undefined}
      >
        <span className="google-icon" aria-hidden="true" />
        {pending ? 'Contacting Google…' : 'Continue with Google'}
      </button>
      {info && (
        <div className="helper" id="google-info" style={{ marginTop: 8 }} role="status" aria-live="polite">
          {info}
        </div>
      )}
    </div>
  );
}

function normalizeError(errorLike) {
  const msg =
    (typeof errorLike === 'string' && errorLike) ||
    errorLike?.message ||
    'Unable to start Google sign-in.';

  // Friendly mapping for typical "unsupported provider" or 400 variants.
  if (/unsupported provider|provider not enabled|400/i.test(msg)) {
    return 'Google sign-in is not enabled. Ask the administrator to enable Google provider in Supabase → Authentication → Providers.';
  }
  // Handle common redirect misconfiguration hints
  if (/redirect/i.test(msg)) {
    return 'Google sign-in configuration issue. Verify the Redirect URL matches this app’s /auth/callback and environment variables are set.';
  }
  return msg;
}
