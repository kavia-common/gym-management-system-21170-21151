import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/Card';
import { fetchWithAuth } from '../../../api/client.ts';
import api from '../../../services/apiClient';

/**
 * PUBLIC_INTERFACE
 * ProgramBuilder (Trainer):
 * - Lists templates and trainer's clients to assign a program
 * - Create a program from template and assign to selected member
 * - Generate program days (e.g., for a date range)
 *
 * Expected endpoints:
 *  - GET /api/v1/workouts/templates
 *  - GET /api/v1/trainers/clients    (to pick member)
 *  - POST /api/v1/workouts/programs
 *    body: { member_id, template_id, name?, start_date?, end_date? }
 *  - POST /api/v1/workouts/programs/{program_id}/days: { generate: 'auto'|'range', start_date?, end_date? }
 *  - GET /api/v1/workouts/programs?member_id=... (to list existing)
 *
 * The UI gracefully degrades if any endpoint is not available.
 */
export default function ProgramBuilder() {
  const base = api.getBaseUrl();
  const url = (p) => `${base}${p.startsWith('/') ? p : `/${p}`}`;

  const [templates, setTemplates] = useState([]);
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loadingTpl, setLoadingTpl] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [errorTpl, setErrorTpl] = useState('');
  const [errorClients, setErrorClients] = useState('');
  const [errorPrograms, setErrorPrograms] = useState('');

  const [memberId, setMemberId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [programName, setProgramName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const loadTemplates = async () => {
    setLoadingTpl(true);
    setErrorTpl('');
    try {
      const resp = await fetchWithAuth(url('/workouts/templates'));
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch {
      setTemplates([]);
      setErrorTpl('Failed to load templates.');
    } finally {
      setLoadingTpl(false);
    }
  };

  const loadClients = async () => {
    setLoadingClients(true);
    setErrorClients('');
    try {
      const resp = await fetchWithAuth(url('/trainers/clients'));
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setClients([]);
      setErrorClients('Failed to load clients.');
    } finally {
      setLoadingClients(false);
    }
  };

  const loadProgramsForMember = async (member) => {
    if (!member) {
      setPrograms([]);
      return;
    }
    setLoadingPrograms(true);
    setErrorPrograms('');
    try {
      const resp = await fetchWithAuth(url(`/workouts/programs?member_id=${encodeURIComponent(member)}`));
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch {
      setPrograms([]);
      setErrorPrograms('Failed to load programs for the selected member.');
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    loadTemplates();
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProgramsForMember(memberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const createProgram = async () => {
    if (!memberId || !templateId) {
      setMsg('Select member and template.');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const payload = {
        member_id: memberId,
        template_id: templateId,
        name: programName || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };
      const resp = await fetchWithAuth(url('/workouts/programs'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const t = await resp.text().catch(()=> '');
        throw new Error(t || 'Create program failed');
      }
      const p = await resp.json();
      setMsg(`Program created (id: ${p?.id || 'unknown'})`);
      await loadProgramsForMember(memberId);
    } catch (e) {
      setMsg(e?.message || 'Failed to create program.');
    } finally {
      setBusy(false);
    }
  };

  const selectedMember = useMemo(() => {
    return clients.find((c) => (c.user_id || c.id) === memberId) || null;
  }, [clients, memberId]);

  const generateDays = async (programId) => {
    const genStart = startDate || new Date().toISOString().slice(0, 10);
    const genEnd = endDate || '';
    setBusy(true);
    setMsg('');
    try {
      const payload = genEnd ? { generate: 'range', start_date: genStart, end_date: genEnd } : { generate: 'auto', start_date: genStart };
      const resp = await fetchWithAuth(url(`/workouts/programs/${encodeURIComponent(programId)}/days`), {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const t = await resp.text().catch(()=> '');
        throw new Error(t || 'Generate days failed');
      }
      setMsg('Program days generated.');
    } catch (e) {
      setMsg(e?.message || 'Failed to generate days.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid">
      <Card title="Program Builder" actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={loadTemplates} disabled={loadingTpl}>{loadingTpl ? 'Loading...' : 'Reload Templates'}</button>
          <button className="btn ghost" onClick={loadClients} disabled={loadingClients}>{loadingClients ? 'Loading...' : 'Reload Clients'}</button>
        </div>
      }>
        {msg && <div className="helper" style={{ marginBottom: 8, color: msg.toLowerCase().includes('fail') || msg.toLowerCase().includes('error') ? 'var(--error)' : 'var(--success)' }}>{msg}</div>}
        <div className="form">
          <div className="grid cols-3">
            <div className="input">
              <label>Member</label>
              <select value={memberId} onChange={(e)=>setMemberId(e.target.value)}>
                <option value="">Select member</option>
                {clients.map((c) => (
                  <option key={c.user_id || c.id} value={c.user_id || c.id}>
                    {(c.name || c.email || (c.user_id || c.id)).toString()}
                  </option>
                ))}
              </select>
              {errorClients && <div className="error-text">{errorClients}</div>}
            </div>
            <div className="input">
              <label>Template</label>
              <select value={templateId} onChange={(e)=>setTemplateId(e.target.value)}>
                <option value="">Select template</option>
                {templates.map((t)=>(
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {errorTpl && <div className="error-text">{errorTpl}</div>}
            </div>
            <div className="input">
              <label>Program Name (optional)</label>
              <input value={programName} onChange={(e)=>setProgramName(e.target.value)} placeholder="Fall Strength Cycle" />
            </div>
          </div>
          <div className="grid cols-3">
            <div className="input">
              <label>Start Date (optional)</label>
              <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            </div>
            <div className="input">
              <label>End Date (optional)</label>
              <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
            </div>
            <div style={{ alignSelf: 'end' }}>
              <button className="btn" onClick={createProgram} disabled={busy}>{busy ? 'Working...' : 'Create Program'}</button>
            </div>
          </div>
        </div>
      </Card>

      <Card title={`Programs ${selectedMember ? `(Member ${selectedMember.name || selectedMember.email || selectedMember.user_id || selectedMember.id})` : ''}`} actions={
        <button className="btn ghost" onClick={()=>loadProgramsForMember(memberId)} disabled={loadingPrograms || !memberId}>
          {loadingPrograms ? 'Loading...' : 'Refresh'}
        </button>
      }>
        {!memberId ? (
          <div className="helper">Select a member to view programs.</div>
        ) : errorPrograms ? (
          <div className="error-text">{errorPrograms}</div>
        ) : !programs.length ? (
          <div className="helper">No programs found for this member.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Template</th><th>Start</th><th>End</th><th>Days</th><th></th></tr>
            </thead>
            <tbody>
              {programs.map((p)=>(
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace' }}>{p.id}</td>
                  <td>{p.name || '—'}</td>
                  <td>{p.template_id || '—'}</td>
                  <td>{p.start_date || '—'}</td>
                  <td>{p.end_date || '—'}</td>
                  <td>{Array.isArray(p.days) ? p.days.length : (p.days_count ?? '—')}</td>
                  <td>
                    <button className="btn ghost" onClick={()=>generateDays(p.id)} disabled={busy}>Generate Days</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="helper" style={{ marginTop: 8 }}>
          Generate Days uses auto or date range based on start/end inputs above.
        </div>
      </Card>
    </div>
  );
}
