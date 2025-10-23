import axios from 'axios';
// Note: This axios client is independent of fetchWithAuth to avoid circular auth recursion.

// Get Base URL from runtime config if available, else .env, else fallback
function getBaseUrl() {
  let url =
    (typeof window !== "undefined" &&
      window.__APP_CONFIG__ &&
      window.__APP_CONFIG__.API_BASE_URL) ||
    process.env.REACT_APP_API_BASE_URL ||
    'http://localhost:3001/api/v1';
  return url.replace(/\/+$/, '');
}

let BASE_URL = getBaseUrl();

// For hot reload, update instance baseURL if config changes:
if (typeof window !== "undefined") {
  window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
  window.__defineSetter__ && window.__defineSetter__('__APP_CONFIG__', function (val) {
    if (val && val.API_BASE_URL) {
      BASE_URL = val.API_BASE_URL.replace(/\/+$/, '');
      instance && (instance.defaults.baseURL = BASE_URL);
    }
  });
}

// Holder for tokens managed by AuthContext
let authTokens = null;

/**
 * Create axios instance.
 * Dynamically uses runtime config for baseURL on each request.
 */
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Re-evaluate baseURL before each request if runtime config may have changed
instance.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  if (authTokens?.access_token) {
    config.headers.Authorization = `Bearer ${authTokens.access_token}`;
  }
  return config;
});

/* Old request interceptor is merged above, included in block above - no-op */

// Handle 401 errors globally
instance.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear tokens and redirect to login
      try {
        localStorage.removeItem('gym.tokens');
      } catch {}
      if (window.location.pathname !== '/signin') {
        window.location.replace('/signin');
      }
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
function setAuthTokens(tokens) {
  authTokens = tokens;
}

// PUBLIC_INTERFACE
async function get(path, params) {
  const res = await instance.get(path, { params });
  return res.data;
}

// PUBLIC_INTERFACE
async function post(path, data) {
  const res = await instance.post(path, data);
  return res.data;
}

// PUBLIC_INTERFACE
async function patch(path, data) {
  const res = await instance.patch(path, data);
  return res.data;
}

// PUBLIC_INTERFACE
async function del(path) {
  const res = await instance.delete(path);
  return res.data;
}

const api = {
  setAuthTokens,
  get,
  post,
  patch,
  del,
  // For debugging
  _axios: instance,
  // PUBLIC_INTERFACE
  getBaseUrl
};

export default api;
