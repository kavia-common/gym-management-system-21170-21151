import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Trainers: Lists trainers and availability; allows user to book a trainer slot.
 */
export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=> {
    const run = async () => {
      try {
        const t = await api.get('/trainers');
        setTrainers(t);
      } catch {}
    };
    run();
  }, []);

  const loadAvailability = async (trainerId) => {
    setSelected(trainerId);
    setAvailability([]);
    try {
      const slots = await api.get(`/trainers/${trainerId}/availability`);
      setAvailability(slots);
    } catch {}
  };

  const bookTrainer = async (trainerId, start, end) => {
    setBusy(true);
    setMsg('');
    try {
      const booking = await api.post('/bookings/trainers', {
        trainer_id: trainerId, start_time: start, end_time: end
      });
      setMsg(`Trainer booked, booking ID ${booking.id}`);
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Booking failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid cols-2">
      <Card title="Trainers">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Bio</th><th></th></tr>
          </thead>
          <tbody>
            {trainers.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.bio}</td>
                <td>
                  <button className="btn" onClick={()=>loadAvailability(t.id)}>View Availability</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title={`Availability ${selected ? `(Trainer ${selected})` : ''}`}>
        {availability.length === 0 ? (
          <div className="helper">Select a trainer to view availability.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Start</th><th>End</th><th></th></tr>
            </thead>
            <tbody>
              {availability.map(slot => (
                <tr key={slot.id}>
                  <td>{new Date(slot.start_time).toLocaleString()}</td>
                  <td>{new Date(slot.end_time).toLocaleString()}</td>
                  <td>
                    <button className="btn" disabled={busy} onClick={()=>bookTrainer(slot.trainer_id, slot.start_time, slot.end_time)}>
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {msg && <div className="helper" style={{ marginTop: 8 }}>{msg}</div>}
      </Card>
    </div>
  );
}
