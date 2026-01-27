class APIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL ?? 'https://diag-helper.onrender.com';
    this.defaultHeaders = {};
    this.logger = null;
  }

  setBaseURL(url) { this.baseURL = url; }

  setHeader(key, value) {
    if (value === undefined || value === null) delete this.defaultHeaders[key];
    else this.defaultHeaders[key] = value;
  }

  setAuthToken(token) {
    if (token) this.setHeader('Authorization', `Bearer ${token}`);
    else this.setHeader('Authorization', undefined);
  }

  setLogger(fn) { this.logger = typeof fn === 'function' ? fn : null; }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
    const method = (options.method || 'GET').toUpperCase();
    const headers = {
      ...this.defaultHeaders,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    };

    if (this.logger) { try { this.logger({ phase: 'request', method, url, body: options.body }); } catch {} }

    const response = await fetch(url, { ...options, method, headers });
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const errorBody = isJson ? await response.json().catch(() => null) : await response.text();
      if (this.logger) { try { this.logger({ phase: 'error', method, url, status: response.status, body: errorBody }); } catch {} }
      const error = new Error(`HTTP ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.body = errorBody;
      throw error;
    }

    const data = isJson ? await response.json() : await response.text();
    if (this.logger) { try { this.logger({ phase: 'response', method, url, status: response.status, body: data }); } catch {} }
    return data;
  }

  get(path) { return this.request(path, { method: 'GET' }); }
  post(path, data) { return this.request(path, { method: 'POST', body: JSON.stringify(data) }); }
  put(path, data) { return this.request(path, { method: 'PUT', body: JSON.stringify(data) }); }
  delete(path) { return this.request(path, { method: 'DELETE' }); }
}

const api = new APIClient();
export default api;
