import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/Card';
import { fetchWithAuth } from '../../../api/client.ts';
import api from '../../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * Trainer Workouts/Templates page:
 * - CRUD Exercises
 *   GET /api/v1/workouts/exercises
 *   POST /api/v1/workouts/exercises
 *   PATCH /api/v1/workouts/exercises/{id}
 *   DELETE /api/v1/workouts/exercises/{id}
 * - CRUD Templates
 *   GET /api/v1/workouts/templates
 *   POST /api/v1/workouts/templates
 *   PATCH /api/v1/workouts/templates/{id}
 *   DELETE /api/v1/workouts/templates/{id}
 *
 * Gracefully handles missing endpoints by showing helper messages.
 */
export default function Templates() {
  const base = api.getBaseUrl();
  // Exercises state
  const [exercises, setExercises] = useState([]);
  const [exLoading, setExLoading] = useState(true);
  const [exError, setExError] = useState('');
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('');
  const [exDesc, setExDesc] = useState('');
  const [busyEx, setBusyEx] = useState(false);

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [tplLoading, setTplLoading] = useState(true);
  const [tplError, setTplError] = useState('');
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');
  // Each item: { exercise_id, sets, reps, note }
  const [tplExercises, setTplExercises] = useState([]);
  const [busyTpl, setBusyTpl] = useState(false);

  // Helper to build URL under /api/v1
  const url = (p) => `${base}${p.startsWith('/') ? p : `/${p}`}`;

  const loadExercises = async () => {
    setExLoading(true);
    setExError('');
    try {
      const resp = await fetchWithAuth(url('/workouts/exercises'));
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setExercises(Array.isArray(data) ? data : []);
    } catch (e) {
      setExercises([]);
      setExError('Exercises endpoint unavailable or failed to load.');
    } finally {
      setExLoading(false);
    }
  };

  const loadTemplates = async () => {
    setTplLoading(true);
    setTplError('');
    try {
      const resp = await fetchWithAuth(url('/workouts/templates'));
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (e) {
      setTemplates([]);
      setTplError('Templates endpoint unavailable or failed to load.');
    } finally {
      setTplLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExercise = async () => {
    if (!exName) {
      setExError('Exercise name is required');
      return;
    }
    setBusyEx(true);
    setExError('');
    try {
      const resp = await fetchWithAuth(url('/workouts/exercises'), {
        method: 'POST',
        body: JSON.stringify({ name: exName, category: exCategory || undefined, description: exDesc || undefined }),
      });
      if (!resp.ok) throw new Error('Create failed');
      setExName(''); setExCategory(''); setExDesc('');
      await loadExercises();
    } catch (e) {
      setExError('Failed to create exercise.');
    } finally {
      setBusyEx(false);
    }
  };

  const removeExercise = async (id) => {
    setBusyEx(true);
    setExError('');
    try {
      const resp = await fetchWithAuth(url(`/workouts/exercises/${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      await loadExercises();
    } catch (e) {
      setExError('Failed to delete exercise.');
    } finally {
      setBusyEx(false);
    }
  };

  const addTemplateRow = () => {
    setTplExercises((prev) => [...prev, { exercise_id: '', sets: 3, reps: 10, note: '' }]);
  };

  const updateTemplateRow = (idx, field, value) => {
    setTplExercises((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeTemplateRow = (idx) => {
    setTplExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const addTemplate = async () => {
    if (!tplName) {
      setTplError('Template name is required');
      return;
    }
    if (!tplExercises.length) {
      setTplError('Add at least one exercise to the template');
      return;
    }
    setBusyTpl(true);
    setTplError('');
    try {
      const payload = {
        name: tplName,
        description: tplDesc || undefined,
        items: tplExercises
          .filter((it) => it.exercise_id)
          .map((it, idx) => ({
            order: idx + 1,
            exercise_id: it.exercise_id,
            sets: Number(it.sets) || 0,
            reps: Number(it.reps) || 0,
            note: it.note || undefined,
          })),
      };
      const resp = await fetchWithAuth(url('/workouts/templates'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Create failed');
      setTplName(''); setTplDesc(''); setTplExercises([]);
      await loadTemplates();
    } catch (e) {
      setTplError('Failed to create template.');
    } finally {
      setBusyTpl(false);
    }
  };

  const deleteTemplate = async (id) => {
    setBusyTpl(true);
    setTplError('');
    try {
      const resp = await fetchWithAuth(url(`/workouts/templates/${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      await loadTemplates();
    } catch (e) {
      setTplError('Failed to delete template.');
    } finally {
      setBusyTpl(false);
    }
  };

  const exerciseOptions = useMemo(() => {
    return exercises.map((e) => ({ value: e.id, label: `${e.name}${e.category ? ` (${e.category})` : ''}` }));
  }, [exercises]);

  return (
    <div className="grid">
      {/* Exercises */}
      <Card title="Exercises" actions={<button className="btn ghost" onClick={loadExercises} disabled={exLoading}>{exLoading ? 'Loading...' : 'Refresh'}</button>}>
        {exError && <div className="error-text" style={{ marginBottom: 8 }}>{exError}</div>}
        <div className="form" style={{ marginBottom: 12 }}>
          <div className="grid cols-3">
            <div className="input">
              <label>Name</label>
              <input value={exName} onChange={(e)=>setExName(e.target.value)} placeholder="Bench Press" />
            </div>
            <div className="input">
              <label>Category</label>
              <input value={exCategory} onChange={(e)=>setExCategory(e.target.value)} placeholder="Chest" />
            </div>
            <div className="input">
              <label>Description</label>
              <input value={exDesc} onChange={(e)=>setExDesc(e.target.value)} placeholder="Flat barbell press" />
            </div>
          </div>
          <div>
            <button className="btn" onClick={addExercise} disabled={busyEx}>{busyEx ? 'Saving...' : 'Add Exercise'}</button>
          </div>
        </div>
        {exLoading ? (
          <div>Loading...</div>
        ) : exercises.length ? (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Category</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id}>
                  <td style={{ fontFamily: 'monospace' }}>{ex.id}</td>
                  <td>{ex.name}</td>
                  <td>{ex.category || '—'}</td>
                  <td>{ex.description || '—'}</td>
                  <td><button className="btn ghost" onClick={() => removeExercise(ex.id)} disabled={busyEx}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="helper">No exercises yet.</div>}
      </Card>

      {/* Templates */}
      <Card title="Workout Templates" actions={<button className="btn ghost" onClick={loadTemplates} disabled={tplLoading}>{tplLoading ? 'Loading...' : 'Refresh'}</button>}>
        {tplError && <div className="error-text" style={{ marginBottom: 8 }}>{tplError}</div>}
        <div className="form" style={{ marginBottom: 12 }}>
          <div className="grid cols-2">
            <div className="input">
              <label>Template Name</label>
              <input value={tplName} onChange={(e)=>setTplName(e.target.value)} placeholder="Push Day A" />
            </div>
            <div className="input">
              <label>Description</label>
              <input value={tplDesc} onChange={(e)=>setTplDesc(e.target.value)} placeholder="Chest/Shoulders/Triceps focus" />
            </div>
          </div>
          <div className="helper" style={{ marginTop: 6 }}>Template Items</div>
          {tplExercises.length === 0 && (
            <div className="helper" style={{ background: 'rgba(30,58,138,0.05)', padding: 8, borderRadius: 8 }}>
              Add one or more exercises for this template.
            </div>
          )}
          {tplExercises.map((row, idx) => (
            <div key={idx} className="grid cols-4" style={{ alignItems: 'end' }}>
              <div className="input">
                <label>Exercise</label>
                <select value={(row.exercise_id ?? '').toString()} onChange={(e)=>updateTemplateRow(idx, 'exercise_id', e.target.value)}>
                  <option value="">Select exercise</option>
                  {exerciseOptions.map((opt)=>(
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="input">
                <label>Sets</label>
                <input type="number" value={row.sets ?? ''} onChange={(e)=>updateTemplateRow(idx, 'sets', e.target.value)} placeholder="3" />
              </div>
              <div className="input">
                <label>Reps</label>
                <input type="number" value={row.reps ?? ''} onChange={(e)=>updateTemplateRow(idx, 'reps', e.target.value)} placeholder="10" />
              </div>
              <div className="input">
                <label>Note</label>
                <input value={row.note || ''} onChange={(e)=>updateTemplateRow(idx, 'note', e.target.value)} placeholder="RPE 8" />
              </div>
              <div>
                <button className="btn ghost" type="button" onClick={()=>removeTemplateRow(idx)}>Remove</button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <button className="btn ghost" type="button" onClick={addTemplateRow}>Add Exercise</button>
            <button className="btn" type="button" onClick={addTemplate} disabled={busyTpl}>{busyTpl ? 'Saving...' : 'Create Template'}</button>
          </div>
        </div>

        {tplLoading ? (
          <div>Loading...</div>
        ) : templates.length ? (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Description</th><th>Items</th><th></th></tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace' }}>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.description || '—'}</td>
                  <td>
                    {Array.isArray(t.items) && t.items.length ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {t.items.map((it, i) => (
                          <li key={i}>
                            #{it.order || i+1} ex:{it.exercise_id} sets:{it.sets} reps:{it.reps} {it.note ? `(${it.note})` : ''}
                          </li>
                        ))}
                      </ul>
                    ) : <span className="helper">—</span>}
                  </td>
                  <td><button className="btn ghost" onClick={()=>deleteTemplate(t.id)} disabled={busyTpl}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <div className="helper">No templates yet.</div>}
      </Card>
    </div>
  );
}
