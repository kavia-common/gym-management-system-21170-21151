import axios from 'axios';

const DEFAULT_BASE = 'http://localhost:3001/api/v1';
const BASE_URL = (process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');

// Holder for tokens managed by AuthContext
let authTokens = null;

// Create axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Attach Authorization header
instance.interceptors.request.use((config) => {
  if (authTokens?.access_token) {
    config.headers.Authorization = `Bearer ${authTokens.access_token}`;
  }
  return config;
});

// Handle 401 errors globally
instance.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear tokens and redirect to login
      try {
        localStorage.removeItem('gym.tokens');
      } catch {}
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
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
  getBaseUrl() { return BASE_URL; }
};

export default api;
