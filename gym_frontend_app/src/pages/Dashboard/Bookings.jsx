import React, { useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Bookings: Simple utilities to cancel a class or trainer booking by ID.
 * Note: OpenAPI spec lacks a "list bookings" endpoint; we provide basic cancel tools.
 */
export default function Bookings() {
  const [classBookingId, setClassBookingId] = useState('');
  const [trainerBookingId, setTrainerBookingId] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const cancelClass = async () => {
    if (!classBookingId) return;
    setBusy(true); setMsg('');
    try {
      const res = await api.del(`/bookings/classes/${classBookingId}`);
      setMsg(`Class booking ${res.id} canceled`);
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Cancel failed');
    } finally {
      setBusy(false);
    }
  };

  const cancelTrainer = async () => {
    if (!trainerBookingId) return;
    setBusy(true); setMsg('');
    try {
      const res = await api.del(`/bookings/trainers/${trainerBookingId}`);
      setMsg(`Trainer booking ${res.id} canceled`);
    } catch (e) {
      setMsg(e?.response?.data?.detail || 'Cancel failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid cols-2">
      <Card title="Cancel Class Booking">
        <div className="form">
          <div className="input">
            <label>Booking ID</label>
            <input value={classBookingId} onChange={(e)=>setClassBookingId(e.target.value)} placeholder="Enter booking id" />
          </div>
          <button className="btn error" disabled={busy} onClick={cancelClass}>Cancel Booking</button>
        </div>
      </Card>
      <Card title="Cancel Trainer Booking">
        <div className="form">
          <div className="input">
            <label>Booking ID</label>
            <input value={trainerBookingId} onChange={(e)=>setTrainerBookingId(e.target.value)} placeholder="Enter booking id" />
          </div>
          <button className="btn error" disabled={busy} onClick={cancelTrainer}>Cancel Booking</button>
        </div>
      </Card>
      {msg && <Card><div className="helper">{msg}</div></Card>}
    </div>
  );
}
