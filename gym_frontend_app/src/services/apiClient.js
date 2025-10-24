const DEFAULT_BASE = process.env.REACT_APP_API_BASE_URL || '/api/v1';

/**
 * PUBLIC_INTERFACE
 * Simple API client helper returning base URL and request helpers.
 */
const api = {
  getBaseUrl() {
    return DEFAULT_BASE;
  },
};

export default api;
