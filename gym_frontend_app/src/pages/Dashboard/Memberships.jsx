import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Memberships: Lists plans, shows current membership, and allows subscribe/cancel.
 */
export default function Memberships() {
  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const data = await api.get('/memberships/plans');
      setPlans(data);
    } catch (e) { setError('Failed to load plans'); }
    try {
      const mem = await api.get('/memberships/current');
      setMembership(mem);
    } catch { setMembership(null); }
  };

  useEffect(() => { load(); }, []);

  const subscribe = async (planId, priceCents) => {
    setBusy(true);
    setError('');
    try {
      // Subscribe
      const res = await api.post('/memberships/subscribe', { plan_id: planId });
      setMembership(res);
      // Create a payment session in case the backend requires payment
      try {
        await api.post('/payments/session', { reference_type: 'membership', reference_id: res.id, amount_cents: priceCents });
      } catch {}
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || 'Subscription failed');
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.post('/memberships/cancel', {});
      setMembership(res);
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || 'Cancel failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid cols-2">
      <Card title="Current membership" actions={membership && <button className="btn error" disabled={busy} onClick={cancel}>Cancel</button>}>
        {membership ? (
          <div>
            <div>Status: <b>{membership.status}</b></div>
            <div>Plan ID: {membership.plan_id}</div>
            <div>Start: {membership.start_date || '-'}</div>
            <div>End: {membership.end_date || '-'}</div>
          </div>
        ) : <div className="helper">No active membership</div>}
      </Card>
      <Card title="Available plans">
        {error && <div className="error-text" style={{ marginBottom: 8 }}>{error}</div>}
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Interval</th><th>Price</th><th></th></tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.interval}</td>
                <td>${(p.price_cents/100).toFixed(2)}</td>
                <td>
                  <button className="btn" disabled={busy} onClick={()=>subscribe(p.id, p.price_cents)}>Subscribe</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
