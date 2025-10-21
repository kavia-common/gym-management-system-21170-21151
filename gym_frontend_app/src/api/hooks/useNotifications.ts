import api from '../../services/apiClient';
import { fetchWithAuth } from '../client.ts';

/**
 * PUBLIC_INTERFACE
 * getApiBase: Returns configured API base (usually ending with /api/v1).
 */
export function getApiBase(): string {
  return api.getBaseUrl();
}

/**
 * Build a URL under API base, ensuring single slash.
 */
function buildUrl(path: string): string {
  const base = getApiBase().replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * PUBLIC_INTERFACE
 * fetchUnreadCount: GET /api/v1/notifications/unread-count
 * Returns a number representing the unread notifications count.
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const resp = await fetchWithAuth(buildUrl('/notifications/unread-count'));
    if (!resp.ok) return 0;
    const data = await resp.json();
    if (typeof data === 'number') return data;
    if (data && typeof data.count === 'number') return data.count;
    return 0;
  } catch {
    return 0;
  }
}

/**
 * PUBLIC_INTERFACE
 * listNotifications: GET /api/v1/notifications?status=unread|all
 * Returns array of notifications. Falls back to [].
 */
export async function listNotifications(status: 'unread' | 'all' = 'unread'): Promise<any[]> {
  try {
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    const resp = await fetchWithAuth(buildUrl(`/notifications?${qs.toString()}`));
    if (!resp.ok) return [];
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * PUBLIC_INTERFACE
 * markNotificationRead: POST /api/v1/notifications/{id}/read
 * Returns { ok, message? }.
 */
export async function markNotificationRead(id: string | number): Promise<{ ok: boolean; message?: string }> {
  try {
    const resp = await fetchWithAuth(buildUrl(`/notifications/${encodeURIComponent(String(id))}/read`), {
      method: 'POST',
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      return { ok: false, message: t || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}

/**
 * PUBLIC_INTERFACE
 * markAllNotificationsRead: POST /api/v1/notifications/mark-all-read
 * Returns { ok, message? }.
 */
export async function markAllNotificationsRead(): Promise<{ ok: boolean; message?: string }> {
  try {
    const resp = await fetchWithAuth(buildUrl('/notifications/mark-all-read'), { method: 'POST' });
    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      return { ok: false, message: t || `HTTP ${resp.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'request failed' };
  }
}
