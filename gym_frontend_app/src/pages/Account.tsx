import React, { useState } from 'react';
import { useMe } from '../hooks';

/**
 * PUBLIC_INTERFACE
 * Account: Protected page that displays current user info from backend /api/me
 * and includes a demo ping to /api/protected.
 */
export default function Account() {
  const { data, loading, error, refetch, pingProtected } = useMe();
  const [pingMsg, setPingMsg] = useState<string>('');
  const [pinging, setPinging] = useState<boolean>(false);

  const doPing = async () => {
    setPinging(true);
    setPingMsg('');
    const res = await pingProtected();
    setPingMsg(res.ok ? `Protected OK: ${res.message}` : `Protected failed: ${res.message}`);
    setPinging(false);
  };

  return (
    <div className="grid">
      <section className="card">
        <div className="card-header">
          <div className="card-title">My Account</div>
          <div>
            <button className="btn ghost" onClick={refetch}>Refresh</button>
          </div>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="error-text" style={{ marginBottom: 8 }}>{error}</div>}
        {!loading && !error && data && (
          <div style={{ lineHeight: 1.8 }}>
            <div><b>User ID (sub)</b>: {data.user_id}</div>
            <div><b>Email</b>: {data.email || '-'}</div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">Protected API Demo</div>
          <div>
            <button className="btn" onClick={doPing} disabled={pinging}>{pinging ? 'Pinging...' : 'Ping /api/protected'}</button>
          </div>
        </div>
        {pingMsg && <div className="helper">{pingMsg}</div>}
        {!pingMsg && <div className="helper">Click the button to test a protected endpoint using your Supabase access token.</div>}
      </section>
    </div>
  );
}
