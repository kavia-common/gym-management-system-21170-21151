import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Overview: Shows quick links and a snapshot of current membership and upcoming sessions.
 */
export default function Overview() {
  const [membership, setMembership] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const run = async () => {
      try {
        const mem = await api.get('/memberships/current');
        setMembership(mem);
      } catch {}
      try {
        const sess = await api.get('/classes/sessions');
        setSessions(sess?.slice?.(0,5) || []);
      } catch {}
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="grid cols-2">
      <Card title="Membership">
        {loading ? 'Loading...' : (
          membership ? (
            <div>
              <div>Status: <b>{membership.status}</b></div>
              <div>Plan ID: {membership.plan_id}</div>
              <div>Start: {membership.start_date || '-'}</div>
              <div>End: {membership.end_date || '-'}</div>
            </div>
          ) : <div className="helper">No active membership</div>
        )}
      </Card>
      <Card title="Upcoming Sessions">
        {loading ? 'Loading...' : (
          sessions && sessions.length ? (
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Class</th><th>Start</th><th>End</th><th>Spots</th></tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.class_id}</td>
                    <td>{new Date(s.start_time).toLocaleString()}</td>
                    <td>{new Date(s.end_time).toLocaleString()}</td>
                    <td>{s.spots_remaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="helper">No sessions</div>
        )}
      </Card>
    </div>
  );
}
