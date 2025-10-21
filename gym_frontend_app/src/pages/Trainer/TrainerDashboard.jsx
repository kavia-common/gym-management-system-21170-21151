import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { listTrainerClients, listRecentClientLogs } from '../../api/hooks/useTrainerApi.js';

/**
 * PUBLIC_INTERFACE
 * TrainerDashboard: Home for trainers showing:
 * - Assigned clients list (first 6)
 * - Recent client activity logs (if available)
 * - Quick actions to manage clients and view full list
 */
export default function TrainerDashboard() {
  const [clients, setClients] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errClients, setErrClients] = useState('');
  const [errLogs, setErrLogs] = useState('');

  const load = async () => {
    setLoading(true);
    setErrClients('');
    setErrLogs('');
    try {
      const c = await listTrainerClients();
      setClients(Array.isArray(c) ? c : []);
    } catch {
      setClients([]);
      setErrClients('Failed to load clients.');
    }
    try {
      const l = await listRecentClientLogs();
      setLogs(Array.isArray(l) ? l : []);
    } catch {
      setLogs([]);
      setErrLogs('Failed to load recent activity.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="grid cols-3">
      <Card title="My Clients" actions={<a className="btn ghost" href="/dashboard/trainer/clients">Manage Clients</a>}>
        {loading ? 'Loading...' : (
          <>
            {errClients && <div className="error-text" style={{ marginBottom: 8 }}>{errClients}</div>}
            {clients.length ? (
              <table className="table" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr><th style={{ width: '50%' }}>Name/Email</th><th style={{ width: '50%' }}>User ID</th></tr>
                </thead>
                <tbody>
                  {clients.slice(0, 6).map((c) => (
                    <tr key={c.user_id || c.id}>
                      <td style={{ wordBreak: 'break-word' }}>{c.name || c.email || '—'}</td>
                      <td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{c.user_id || c.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="helper" style={{ background: 'rgba(30,58,138,0.05)', padding: 8, borderRadius: 8 }}>No clients assigned yet.</div>}
          </>
        )}
      </Card>

      <Card title="Recent Activity" actions={<button className="btn ghost" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>}>
        {loading ? 'Loading...' : (
          <>
            {errLogs && <div className="error-text" style={{ marginBottom: 8 }}>{errLogs}</div>}
            {logs.length ? (
              <table className="table">
                <thead>
                  <tr><th>When</th><th>Client</th><th>Event</th></tr>
                </thead>
                <tbody>
                  {logs.slice(0, 8).map((l, idx) => (
                    <tr key={l.id || idx}>
                      <td>{l.timestamp ? new Date(l.timestamp).toLocaleString() : '—'}</td>
                      <td>{l.client_email || l.client_name || l.client_id || '—'}</td>
                      <td>{l.event || l.type || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="helper" style={{ background: 'rgba(30,58,138,0.05)', padding: 8, borderRadius: 8 }}>No recent logs.</div>}
          </>
        )}
      </Card>

      <Card title="Quick Actions">
        <div className="grid">
          <div>
            <a className="btn" href="/dashboard/trainer/clients">Add/Remove Clients</a>
          </div>
          <div>
            <a className="btn ghost" href="/dashboard/trainers">Browse Trainers (public)</a>
          </div>
          <div>
            <button className="btn ghost" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
