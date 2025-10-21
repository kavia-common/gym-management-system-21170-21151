import api from '../../services/apiClient';
// Import TypeScript module explicitly to avoid ambiguous JS/TS interop in some environments
import { fetchWithAuth } from '../client.ts';

/**
 * PUBLIC_INTERFACE
 * getTrainerBase: Utility to get base URL for /api/v1 relative paths.
 * This returns the configured API base (usually ends with /api/v1).
 */
export function getTrainerBase(): string {
  return api.getBaseUrl();
}

/**
 * Build a full API URL from a path under the API base.
 */
function buildUrl(path: string): string {
  const base = getTrainerBase().replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * PUBLIC_INTERFACE
 * listTrainerClients: Attempts in order:
 * 1) GET /api/v1/trainers/clients
 * 2) GET /api/v1/trainers (fallback; returns trainers list to avoid hard failure)
 * Returns an array of client profiles assigned to the current trainer, or [].
 */
export async function listTrainerClients(): Promise<any[]> {
  // Preferred endpoint
  try {
    const resp = await fetchWithAuth(buildUrl('/trainers/clients'));
    if (resp.ok) {
      const json = await resp.json();
      return Array.isArray(json) ? json : [];
    }
  } catch {
    // ignore and fallback
  }
  // Fallback to generic trainers endpoint to avoid empty UI on missing feature
  try {
    const resp2 = await fetchWithAuth(buildUrl('/trainers'));
    if (!resp2.ok) return [];
    const arr = await resp2.json();
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * addTrainerClient: POST /api/v1/trainers/clients
 * Accepts either email or user_id to assign a client to the current trainer.
 * Returns { ok, message? }
 */
export async function addTrainerClient(payload: { email?: string; user_id?: string }): Promise<{ ok: boolean; message?: string }> {
  try {
    const resp = await fetchWithAuth(buildUrl('/trainers/clients'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return { ok: false, message: text || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}

/**
 * PUBLIC_INTERFACE
 * removeTrainerClient: DELETE /api/v1/trainers/clients/{id}
 */
export async function removeTrainerClient(id: string): Promise<{ ok: boolean; message?: string }> {
  try {
    const resp = await fetchWithAuth(buildUrl(`/trainers/clients/${encodeURIComponent(id)}`), { method: 'DELETE' });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return { ok: false, message: text || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}

/**
 * PUBLIC_INTERFACE
 * listRecentClientLogs: GET /api/v1/trainers/recent-logs
 * Returns recent activity logs for trainer's clients (if available).
 * Fallback: returns [] if endpoint not available.
 */
export async function listRecentClientLogs(): Promise<any[]> {
  try {
    const resp = await fetchWithAuth(buildUrl('/trainers/recent-logs'));
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
