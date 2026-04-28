import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ---------- Assets ----------
export const assetsApi = {
  getAll: (type?: string) => api.get('/assets', { params: type ? { type } : {} }),
  getById: (id: string) => api.get(`/assets/${id}`),
  search: (q: string) => api.get('/assets/search', { params: { q } }),
  getPriceHistory: (id: string, limit = 30) => api.get(`/assets/${id}/history`, { params: { limit } }),
  seed: () => api.post('/assets/seed'),
};

// ---------- Portfolios ----------
export const portfoliosApi = {
  getAll: () => api.get('/portfolios'),
  getById: (id: string) => api.get(`/portfolios/${id}`),
  create: (data: { name: string; userId: string; targetReturn?: number }) => api.post('/portfolios', data),
  update: (id: string, data: any) => api.put(`/portfolios/${id}`, data),
  delete: (id: string) => api.delete(`/portfolios/${id}`),
  optimize: (id: string, params: { riskTolerance: number; strategy: string }) =>
    api.post(`/portfolios/${id}/optimize`, params),
  riskAnalysis: (id: string) => api.get(`/portfolios/${id}/risk-analysis`),
  allocationHistory: (id: string) => api.get(`/portfolios/${id}/allocation-history`),
};

// ---------- Users ----------
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; name?: string }) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export default api;
