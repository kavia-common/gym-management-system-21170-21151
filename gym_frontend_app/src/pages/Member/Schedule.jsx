import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';
import { fetchWithAuth } from '../../api/client.ts';

/**
 * PUBLIC_INTERFACE
 * Schedule: Displays a member's upcoming schedule.
 * - Tries /api/v1/schedule first (if backend implements it)
 * - Falls back to class sessions list
 */
export default function Schedule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('schedule');

  const load = async () => {
    setLoading(true);
    // Try unified schedule endpoint
    try {
      const base = api.getBaseUrl();
      const resp = await fetchWithAuth(`${base}/schedule`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          setItems(data);
          setSource('schedule');
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }
    // Fallback to sessions
    try {
      const sess = await api.get('/classes/sessions');
      const mapped = (Array.isArray(sess) ? sess : []).map((s) => ({
        id: s.id,
        type: 'class_session',
        title: `Class #${s.class_id}`,
        start_time: s.start_time,
        end_time: s.end_time,
        meta: { class_id: s.class_id, spots_remaining: s.spots_remaining },
      }));
      setItems(mapped);
      setSource('sessions');
    } catch {
      setItems([]);
      setSource('none');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const groups = {};
    (items || []).forEach((it) => {
      const key = it.start_time ? new Date(it.start_time).toDateString() : 'Unknown';
      groups[key] = groups[key] || [];
      groups[key].push(it);
    });
    return groups;
  }, [items]);

  return (
    <div className="grid">
      <Card title="My Schedule">
        <div className="helper" style={{ marginBottom: 8 }}>
          Source: {source === 'schedule' ? '/api/v1/schedule' : source === 'sessions' ? '/api/v1/classes/sessions' : 'N/A'}
        </div>
        {loading ? (
          'Loading...'
        ) : items.length === 0 ? (
          <div className="helper">No upcoming items.</div>
        ) : (
          Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b)).map((day) => (
            <div key={day} className="card" style={{ marginTop: 12 }}>
              <div className="card-header">
                <div className="card-title">{day}</div>
              </div>
              <table className="table">
                <thead>
                  <tr><th>Start</th><th>End</th><th>Title</th><th>Type</th></tr>
                </thead>
                <tbody>
                  {grouped[day]
                    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                    .map((it) => (
                    <tr key={`${it.type}-${it.id}`}>
                      <td>{it.start_time ? new Date(it.start_time).toLocaleTimeString() : '-'}</td>
                      <td>{it.end_time ? new Date(it.end_time).toLocaleTimeString() : '-'}</td>
                      <td>{it.title || `${it.type} #${it.id}`}</td>
                      <td>{it.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
