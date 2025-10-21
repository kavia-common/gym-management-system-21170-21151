import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { addTrainerClient, listTrainerClients, removeTrainerClient } from '../../api/hooks/useTrainerApi.js';

/**
 * PUBLIC_INTERFACE
 * Trainer Clients Management:
 * - List current clients assigned to the trainer
 * - Add client by email or user_id
 * - Remove client assignment
 * - View basic assignment info (if present in payload)
 */
export default function Clients() {
  const [clients, setClients] = useState([]);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const c = await listTrainerClients();
      setClients(Array.isArray(c) ? c : []);
    } catch (e) {
      setClients([]);
      setError('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    if (!email && !userId) {
      setMsg('Please provide email or user id');
      return;
    }
    setBusy(true); setMsg(''); setError('');
    const payload = email ? { email } : { user_id: userId };
    const res = await addTrainerClient(payload);
    if (!res.ok) {
      setError(res.message || 'Add failed');
    } else {
      setMsg('Client added');
      setEmail(''); setUserId('');
      await load();
    }
    setBusy(false);
  };

  const onRemove = async (id) => {
    setBusy(true); setMsg(''); setError('');
    const res = await removeTrainerClient(id);
    if (!res.ok) {
      setError(res.message || 'Remove failed');
    } else {
      setMsg('Client removed');
      await load();
    }
    setBusy(false);
  };

  return (
    <div className="grid">
      <Card title="Add Client">
        <div className="form">
          <div className="grid cols-2">
            <div className="input">
              <label>Email</label>
              <input type="email" placeholder="client@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="input">
              <label>User ID</label>
              <input placeholder="uuid-or-internal-id" value={userId} onChange={(e)=>setUserId(e.target.value)} />
            </div>
          </div>
          <div className="helper" style={{ background: 'rgba(30,58,138,0.05)', padding: 8, borderRadius: 8 }}>
            Provide either email or user id. Email takes precedence when both are provided.
          </div>
          <div>
            <button className="btn" disabled={busy} onClick={onAdd}>{busy ? 'Working...' : 'Add Client'}</button>
          </div>
          {msg && (
            <div className="helper" style={{ marginTop: 8, color: msg.toLowerCase().includes('fail') ? 'var(--error)' : 'var(--success)' }}>
              {msg}
            </div>
          )}
          {error && (
            <div className="error-text" style={{ marginTop: 8 }}>
              {error}
            </div>
          )}
        </div>
      </Card>

      <Card title="My Clients" actions={<button className="btn ghost" onClick={load} disabled={busy || loading}>{loading ? 'Loading...' : 'Refresh'}</button>}>
        {loading ? (
          <div>Loading...</div>
        ) : clients.length === 0 ? (
          <div className="helper">No clients assigned.</div>
        ) : (
          <table className="table" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr><th style={{ width: '35%' }}>Name/Email</th><th style={{ width: '35%' }}>User ID</th><th style={{ width: '20%' }}>Assigned Since</th><th style={{ width: '10%' }}></th></tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.user_id || c.id}>
                  <td style={{ wordBreak: 'break-word' }}>{c.name || c.email || '—'}</td>
                  <td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{c.user_id || c.id}</td>
                  <td>{c.assigned_at ? new Date(c.assigned_at).toLocaleString() : '—'}</td>
                  <td>
                    <button className="btn ghost" disabled={busy} onClick={() => onRemove(c.user_id || c.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && !loading && (
          <div className="error-text" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}
      </Card>
    </div>
  );
}
