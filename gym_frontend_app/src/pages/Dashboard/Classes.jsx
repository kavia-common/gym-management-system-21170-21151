import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Classes: Lists class types and sessions; allows booking and canceling bookings.
 */
export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const cls = await api.get('/classes');
      setClasses(cls);
    } catch {}
    try {
      const sess = await api.get('/classes/sessions');
      setSessions(sess);
    } catch {}
  };

  useEffect(()=> { load(); }, []);

  const book = async (sessionId) => {
    setBusy(true);
    setMsg('');
    try {
      const booking = await api.post('/bookings/classes', { class_session_id: sessionId });
      setMsg(`Booked class, booking ID ${booking.id}`);
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Booking failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid cols-2">
      <Card title="Classes">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Description</th><th>Capacity</th></tr>
          </thead>
          <tbody>
            {classes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{c.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Sessions">
        {msg && <div className="helper" style={{ marginBottom: 8 }}>{msg}</div>}
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Class</th><th>Start</th><th>End</th><th>Spots Left</th><th></th></tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.class_id}</td>
                <td>{new Date(s.start_time).toLocaleString()}</td>
                <td>{new Date(s.end_time).toLocaleString()}</td>
                <td>{s.spots_remaining}</td>
                <td>
                  <button className="btn" disabled={busy || s.spots_remaining <= 0} onClick={() => book(s.id)}>
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
