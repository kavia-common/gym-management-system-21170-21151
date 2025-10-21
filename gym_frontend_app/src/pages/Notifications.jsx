import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useSupabaseAuth } from '../context/AuthContext';
import { listNotifications, markNotificationRead, markAllNotificationsRead, fetchUnreadCount } from '../api/hooks/useNotifications.ts';

/**
 * PUBLIC_INTERFACE
 * Notifications page: Lists notifications (Unread/All), allows mark-as-read on individual or all.
 * Access: Protected for 'member' and 'trainer' roles.
 */
export default function Notifications() {
  const { role } = useSupabaseAuth();
  const [tab, setTab] = useState('unread'); // 'unread' | 'all'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const arr = await listNotifications(tab === 'all' ? 'all' : 'unread');
      setItems(arr);
    } catch {
      setItems([]);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const loadCount = async () => {
    const c = await fetchUnreadCount();
    setUnreadCount(c);
  };

  useEffect(() => {
    load();
    loadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const onMarkOne = async (id) => {
    setBusy(true);
    const res = await markNotificationRead(id);
    if (!res.ok) {
      setError(res.message || 'Failed to mark as read.');
    } else {
      await Promise.all([load(), loadCount()]);
    }
    setBusy(false);
  };

  const onMarkAll = async () => {
    setBusy(true);
    const res = await markAllNotificationsRead();
    if (!res.ok) {
      setError(res.message || 'Failed to mark all as read.');
    } else {
      await Promise.all([load(), loadCount()]);
    }
    setBusy(false);
  };

  const roleOk = role === 'member' || role === 'trainer';

  return (
    <div className="grid">
      <Card
        title="Notifications"
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="helper">Unread: {unreadCount}</span>
            <button className="btn ghost" onClick={load} disabled={loading || busy}>{loading ? 'Loading...' : 'Refresh'}</button>
            <button className="btn" onClick={onMarkAll} disabled={busy || unreadCount === 0}>Mark All Read</button>
          </div>
        }
      >
        {!roleOk && (
          <div className="error-text" style={{ marginBottom: 8 }}>
            Your role does not have access to this page.
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            className={`btn ghost${tab === 'unread' ? '' : ''}`}
            style={{ background: tab === 'unread' ? 'rgba(30,58,138,0.08)' : 'transparent' }}
            onClick={() => setTab('unread')}
            disabled={busy}
          >
            Unread
          </button>
          <button
            className={`btn ghost${tab === 'all' ? '' : ''}`}
            style={{ background: tab === 'all' ? 'rgba(30,58,138,0.08)' : 'transparent' }}
            onClick={() => setTab('all')}
            disabled={busy}
          >
            All
          </button>
        </div>

        {error && <div className="error-text" style={{ marginBottom: 8 }}>{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : !items || items.length === 0 ? (
          <div className="helper">
            {tab === 'unread' ? 'No unread notifications.' : 'No notifications.'}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '16%' }}>When</th>
                <th>Title</th>
                <th>Message</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => {
                const created = n.created_at || n.timestamp || n.created || null;
                const status = n.read_at ? 'read' : (n.status || 'unread');
                return (
                  <tr key={n.id}>
                    <td>{created ? new Date(created).toLocaleString() : '—'}</td>
                    <td>{n.title || n.type || '—'}</td>
                    <td>{n.message || n.body || n.description || '—'}</td>
                    <td>
                      <span
                        className="helper"
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: status === 'unread' ? 'rgba(30,58,138,0.10)' : 'rgba(5,150,105,0.10)',
                          color: status === 'unread' ? 'var(--primary)' : 'var(--success)',
                        }}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      {!n.read_at && (
                        <button className="btn ghost" onClick={() => onMarkOne(n.id)} disabled={busy}>
                          Mark read
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
