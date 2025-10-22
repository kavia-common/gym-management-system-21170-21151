import React, { useState } from 'react';
import api from '../services/apiClient';

// PUBLIC_INTERFACE
export default function DemoBanner() {
  const enabled = (process.env.REACT_APP_DEMO_MODE || '').toString().toLowerCase() === 'true'
    || (typeof window !== 'undefined' && window.__APP_CONFIG__ && String(window.__APP_CONFIG__.DEMO_MODE || '').toLowerCase() === 'true');

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (!enabled) return null;

  const handleReset = async () => {
    setBusy(true);
    setMsg('');
    try {
      const res = await api.post('/demo/reset', {});
      setMsg(`Demo reset: ${res.classes} classes, ${res.sessions} sessions, ${res.trainers} trainers, ${res.plans} plans.`);
    } catch (e) {
      setMsg('Failed to reset demo data');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="demo-banner" role="region" aria-label="Demo Mode">
      <div>
        You are viewing Demo Mode. Data may reset at any time.
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn btn--outline" onClick={handleReset} disabled={busy}>
          {busy ? 'Resetting…' : 'Reset demo data'}
        </button>
        {msg && <span className="helper">{msg}</span>}
      </div>
    </div>
  );
}
