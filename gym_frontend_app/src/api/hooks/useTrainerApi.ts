import api from '../../services/apiClient';
import { fetchWithAuth } from '../client.ts';

/**
 * PUBLIC_INTERFACE
 * getTrainerBase: Utility to get base URL for /api/v1 relative paths.
 */
export function getTrainerBase(): string {
  return api.getBaseUrl();
}

/**
 * PUBLIC_INTERFACE
 * listTrainerClients: GET /trainers/clients (or fallback path if available).
 * Returns an array of client profiles assigned to the current trainer.
 */
export async function listTrainerClients(): Promise<any[]> {
  const base = getTrainerBase();
  // Prefer a trainer-specific list if backend provides; fallback to generic users?clients_of_me
  // Path assumption: /api/v1/trainers/clients
  const resp = await fetchWithAuth(`${base}/trainers/clients`);
  if (!resp.ok) return [];
  return await resp.json();
}

/**
 * PUBLIC_INTERFACE
 * addTrainerClient: POST /trainers/clients
 * Accepts either email or user_id to assign a client to the current trainer.
 */
export async function addTrainerClient(payload: { email?: string; user_id?: string }): Promise<{ ok: boolean; message?: string }> {
  const base = getTrainerBase();
  try {
    const resp = await fetchWithAuth(`${base}/trainers/clients`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(()=>'');
      return { ok: false, message: text || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}

/**
 * PUBLIC_INTERFACE
 * removeTrainerClient: DELETE /trainers/clients/{id}
 */
export async function removeTrainerClient(id: string): Promise<{ ok: boolean; message?: string }> {
  const base = getTrainerBase();
  try {
    const resp = await fetchWithAuth(`${base}/trainers/clients/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!resp.ok) {
      const text = await resp.text().catch(()=>'');
      return { ok: false, message: text || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}

/**
 * PUBLIC_INTERFACE
 * listRecentClientLogs: GET /trainers/recent-logs
 * Returns recent activity logs for trainer's clients (if available).
 * Fallback: returns [] if endpoint not available.
 */
export async function listRecentClientLogs(): Promise<any[]> {
  const base = getTrainerBase();
  try {
    const resp = await fetchWithAuth(`${base}/trainers/recent-logs`);
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
