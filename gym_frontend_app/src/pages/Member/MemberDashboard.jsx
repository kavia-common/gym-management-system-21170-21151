import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';
import { fetchWithAuth } from '../../api/client.ts';

/**
 * PUBLIC_INTERFACE
 * MemberDashboard: Shows a personalized snapshot for members including:
 * - Next workout (nearest upcoming class session if any)
 * - Upcoming schedule (list of next few items)
 * - Progress snapshot (recent exercise logs/body metrics if exposed)
 *
 * This page uses existing API routes available (classes/sessions, memberships/current)
 * and falls back gracefully if certain backend endpoints are not available.
 */
export default function MemberDashboard() {
  const [membership, setMembership] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Try to load schedule from /api/v1/schedule if available, otherwise build from sessions.
  const loadSchedule = async () => {
    try {
      const base = api.getBaseUrl();
      const resp = await fetchWithAuth(`${base}/schedule`);
      if (resp.ok) {
        const data = await resp.json();
        setSchedule(Array.isArray(data) ? data : []);
        return;
      }
    } catch {
      // ignore, we will fallback
    }
    // Fallback: map sessions to schedule-like items
    const mapped = (sessions || []).slice(0, 5).map((s) => ({
      id: s.id,
      type: 'class_session',
      title: `Class #${s.class_id}`,
      start_time: s.start_time,
      end_time: s.end_time,
      meta: { class_id: s.class_id },
    }));
    setSchedule(mapped);
  };

  useEffect(() => {
    const run = async () => {
      try {
        const mem = await api.get('/memberships/current');
        setMembership(mem || null);
      } catch {
        setMembership(null);
      }
      try {
        const sess = await api.get('/classes/sessions');
        const sorted = Array.isArray(sess)
          ? [...sess].sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          : [];
        setSessions(sorted);
      } catch {
        setSessions([]);
      }
      setLoading(false);
    };
    run();
  }, []);

  useEffect(() => {
    loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  const nextWorkout = useMemo(() => {
    const now = Date.now();
    return (sessions || []).find((s) => new Date(s.start_time).getTime() > now) || null;
  }, [sessions]);

  return (
    <div className="grid cols-3">
      <Card title="Next Workout">
        {loading ? (
          'Loading...'
        ) : nextWorkout ? (
          <div>
            <div><b>Class</b>: #{nextWorkout.class_id}</div>
            <div><b>Start</b>: {new Date(nextWorkout.start_time).toLocaleString()}</div>
            <div><b>End</b>: {new Date(nextWorkout.end_time).toLocaleString()}</div>
            <div><b>Spots Left</b>: {nextWorkout.spots_remaining}</div>
          </div>
        ) : (
          <div className="helper">No upcoming session found.</div>
        )}
      </Card>

      <Card title="Membership">
        {loading ? (
          'Loading...'
        ) : membership ? (
          <div>
            <div>Status: <b>{membership.status}</b></div>
            <div>Plan ID: {membership.plan_id}</div>
            <div>Start: {membership.start_date || '-'}</div>
            <div>End: {membership.end_date || '-'}</div>
          </div>
        ) : (
          <div className="helper">No active membership</div>
        )}
      </Card>

      <Card title="Progress Snapshot">
        <div className="helper">
          Track your progress in the Progress page (exercise logs and body metrics).
        </div>
        <div style={{ marginTop: 8 }}>
          <a className="btn ghost" href="/dashboard/member/progress">View Progress</a>
        </div>
      </Card>

      <Card title="Upcoming Schedule" actions={<a className="btn ghost" href="/dashboard/member/schedule">Open Schedule</a>}>
        {loading ? (
          'Loading...'
        ) : schedule.length ? (
          <table className="table">
            <thead>
              <tr><th>When</th><th>Title</th><th>Type</th></tr>
            </thead>
            <tbody>
              {schedule.slice(0, 6).map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>{item.start_time ? new Date(item.start_time).toLocaleString() : '-'}</td>
                  <td>{item.title || `${item.type} #${item.id}`}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="helper">No upcoming items.</div>
        )}
      </Card>
    </div>
  );
}
