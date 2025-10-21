//
// Google Identity Services (GIS) loader and helpers
//

const GIS_SRC = 'https://accounts.google.com/gsi/client';

let loadingPromise = null;

/**
 * Load the Google Identity Services script once and return a promise that resolves when ready.
 */
export function loadGisScript() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    // If already present
    if (document.querySelector(`script[src="${GIS_SRC}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = (e) => reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(s);
  });

  return loadingPromise;
}

/**
 * Initialize the GIS client with the given clientId and callback.
 * Returns true if initialized, false otherwise.
 */
export function initGis(clientId, callback, options = {}) {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) return false;
  if (!clientId) return false;

  // Initialize
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
    use_fedcm_for_prompt: true,
    ...options
  });
  return true;
}

/**
 * Render the Google button into a target element.
 */
export function renderGoogleButton(targetEl, options = {}) {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
  if (!targetEl) return;

  const defaultOptions = {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: 320
  };

  window.google.accounts.id.renderButton(targetEl, {
    ...defaultOptions,
    ...options
  });
}

/**
 * Prompt One Tap (optional).
 */
export function promptOneTap() {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
  try {
    window.google.accounts.id.prompt(); // non-blocking
  } catch {
    // ignore
  }
}
