//
// runtimeConfig.js
//
// PUBLIC_INTERFACE
/**
 * Loads /app-config.json and sets window.__APP_CONFIG__ with its contents.
 * Returns a promise that resolves once config is loaded and set.
 * On error (missing file or malformed), window.__APP_CONFIG__ is kept as {}.
 */
export function loadRuntimeConfig() {
  return fetch('/app-config.json', { credentials: 'same-origin' })
    .then(resp => {
      if (!resp.ok) throw new Error('Failed to fetch runtime config');
      return resp.json();
    })
    .then(config => {
      window.__APP_CONFIG__ = config || {};
      return window.__APP_CONFIG__;
    })
    .catch(() => {
      window.__APP_CONFIG__ = {};
      return window.__APP_CONFIG__;
    });
}
