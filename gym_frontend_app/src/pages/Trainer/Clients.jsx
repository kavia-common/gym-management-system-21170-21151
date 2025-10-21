import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { addTrainerClient, listTrainerClients, removeTrainerClient } from '../../api/hooks/useTrainerApi.ts';

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
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const c = await listTrainerClients();
      setClients(Array.isArray(c) ? c : []);
    } catch {
      setClients([]);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    if (!email && !userId) {
      setMsg('Please provide email or user id');
      return;
    }
    setBusy(true); setMsg('');
    const payload = email ? { email } : { user_id: userId };
    const res = await addTrainerClient(payload);
    if (!res.ok) {
      setMsg(res.message || 'Add failed');
    } else {
      setMsg('Client added');
      setEmail(''); setUserId('');
      await load();
    }
    setBusy(false);
  };

  const onRemove = async (id) => {
    setBusy(true); setMsg('');
    const res = await removeTrainerClient(id);
    if (!res.ok) {
      setMsg(res.message || 'Remove failed');
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
          <div className="helper">Provide either email or user id. Email takes precedence when both are provided.</div>
          <div>
            <button className="btn" disabled={busy} onClick={onAdd}>{busy ? 'Working...' : 'Add Client'}</button>
          </div>
          {msg && <div className="helper" style={{ marginTop: 8 }}>{msg}</div>}
        </div>
      </Card>

      <Card title="My Clients" actions={<button className="btn ghost" onClick={load} disabled={busy}>Refresh</button>}>
        {clients.length === 0 ? (
          <div className="helper">No clients assigned.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name/Email</th><th>User ID</th><th>Assigned Since</th><th></th></tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.user_id || c.id}>
                  <td>{c.name || c.email || '—'}</td>
                  <td style={{ fontFamily: 'monospace' }}>{c.user_id || c.id}</td>
                  <td>{c.assigned_at ? new Date(c.assigned_at).toLocaleString() : '—'}</td>
                  <td>
                    <button className="btn ghost" disabled={busy} onClick={() => onRemove(c.user_id || c.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
