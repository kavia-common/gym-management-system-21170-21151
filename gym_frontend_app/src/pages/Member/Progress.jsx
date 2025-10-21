import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../services/apiClient';
import { fetchWithAuth } from '../../api/client.ts';

/**
 * PUBLIC_INTERFACE
 * Progress: Track exercise logs and body metrics for the member.
 * Endpoints (expected):
 *  - Exercise Logs:
 *    - GET /api/v1/progress/exercise-logs
 *    - POST /api/v1/progress/exercise-logs
 *    - DELETE /api/v1/progress/exercise-logs/{id}
 *  - Body Metrics:
 *    - GET /api/v1/progress/body-metrics
 *    - POST /api/v1/progress/body-metrics
 *
 * If backend endpoints are missing, the UI will show friendly helper copy.
 */
export default function Progress() {
  const base = api.getBaseUrl();
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [errLogs, setErrLogs] = useState('');
  const [errMetrics, setErrMetrics] = useState('');

  // Form states
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');

  const [metricDate, setMetricDate] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const fetchLogs = async () => {
    setLoadingLogs(true);
    setErrLogs('');
    try {
      const resp = await fetchWithAuth(`${base}/progress/exercise-logs`);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrLogs('Exercise logs endpoint unavailable or failed to load.');
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    setErrMetrics('');
    try {
      const resp = await fetchWithAuth(`${base}/progress/body-metrics`);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setMetrics(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrMetrics('Body metrics endpoint unavailable or failed to load.');
      setMetrics([]);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLog = async () => {
    try {
      const resp = await fetchWithAuth(`${base}/progress/exercise-logs`, {
        method: 'POST',
        body: JSON.stringify({
          exercise_name: exerciseName,
          reps: Number(reps) || 0,
          weight: Number(weight) || 0,
          date: date || new Date().toISOString().slice(0, 10),
        }),
      });
      if (!resp.ok) throw new Error('Create failed');
      setExerciseName(''); setReps(''); setWeight(''); setDate('');
      await fetchLogs();
    } catch {
      setErrLogs('Failed to create exercise log.');
    }
  };

  const deleteLog = async (id) => {
    try {
      const resp = await fetchWithAuth(`${base}/progress/exercise-logs/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      await fetchLogs();
    } catch {
      setErrLogs('Failed to delete exercise log.');
    }
  };

  const addMetric = async () => {
    try {
      const resp = await fetchWithAuth(`${base}/progress/body-metrics`, {
        method: 'POST',
        body: JSON.stringify({
          date: metricDate || new Date().toISOString().slice(0, 10),
          weight_kg: weightKg ? Number(weightKg) : undefined,
          body_fat_percent: bodyFat ? Number(bodyFat) : undefined,
        }),
      });
      if (!resp.ok) throw new Error('Create failed');
      setMetricDate(''); setWeightKg(''); setBodyFat('');
      await fetchMetrics();
    } catch {
      setErrMetrics('Failed to create body metric entry.');
    }
  };

  return (
    <div className="grid cols-2">
      <Card title="Exercise Logs" actions={<button className="btn ghost" onClick={fetchLogs}>Refresh</button>}>
        {loadingLogs ? (
          'Loading...'
        ) : (
          <>
            {errLogs && <div className="error-text" style={{ marginBottom: 8 }}>{errLogs}</div>}
            <div className="form" style={{ marginBottom: 12 }}>
              <div className="grid cols-2">
                <div className="input">
                  <label>Exercise</label>
                  <input value={exerciseName} onChange={(e)=>setExerciseName(e.target.value)} placeholder="Bench Press" />
                </div>
                <div className="input">
                  <label>Date</label>
                  <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
                </div>
              </div>
              <div className="grid cols-3">
                <div className="input">
                  <label>Reps</label>
                  <input type="number" value={reps} onChange={(e)=>setReps(e.target.value)} placeholder="10" />
                </div>
                <div className="input">
                  <label>Weight</label>
                  <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="60" />
                </div>
                <div style={{ alignSelf: 'end' }}>
                  <button className="btn" type="button" onClick={addLog}>Add Log</button>
                </div>
              </div>
            </div>
            {logs.length ? (
              <table className="table">
                <thead>
                  <tr><th>Date</th><th>Exercise</th><th>Reps</th><th>Weight</th><th></th></tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id}>
                      <td>{l.date ? new Date(l.date).toLocaleDateString() : '-'}</td>
                      <td>{l.exercise_name}</td>
                      <td>{l.reps}</td>
                      <td>{l.weight}</td>
                      <td><button className="btn ghost" onClick={() => deleteLog(l.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="helper">No exercise logs yet.</div>
            )}
          </>
        )}
      </Card>

      <Card title="Body Metrics" actions={<button className="btn ghost" onClick={fetchMetrics}>Refresh</button>}>
        {loadingMetrics ? (
          'Loading...'
        ) : (
          <>
            {errMetrics && <div className="error-text" style={{ marginBottom: 8 }}>{errMetrics}</div>}
            <div className="form" style={{ marginBottom: 12 }}>
              <div className="grid cols-3">
                <div className="input">
                  <label>Date</label>
                  <input type="date" value={metricDate} onChange={(e)=>setMetricDate(e.target.value)} />
                </div>
                <div className="input">
                  <label>Weight (kg)</label>
                  <input type="number" value={weightKg} onChange={(e)=>setWeightKg(e.target.value)} placeholder="75" />
                </div>
                <div className="input">
                  <label>Body Fat (%)</label>
                  <input type="number" value={bodyFat} onChange={(e)=>setBodyFat(e.target.value)} placeholder="18" />
                </div>
              </div>
              <div>
                <button className="btn" type="button" onClick={addMetric}>Add Metric</button>
              </div>
            </div>

            {metrics.length ? (
              <table className="table">
                <thead>
                  <tr><th>Date</th><th>Weight (kg)</th><th>Body Fat (%)</th></tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.id}>
                      <td>{m.date ? new Date(m.date).toLocaleDateString() : '-'}</td>
                      <td>{m.weight_kg ?? '-'}</td>
                      <td>{m.body_fat_percent ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="helper">No body metrics yet.</div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
