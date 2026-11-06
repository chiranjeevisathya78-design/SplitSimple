import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  searchUsers: (query = '') => api.get(`/auth/users/search?q=${encodeURIComponent(query)}&email=${encodeURIComponent(query)}`),
};

export const groupService = {
  create: (data) => api.post('/groups', data),
  getAll: () => api.get('/groups'),
  getById: (id) => api.get(`/groups/${id}`),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
  getBalances: (id) => api.get(`/groups/${id}/balances`),
  joinDemo: () => api.post('/groups/join-demo'),
  addMember: (id, email) => api.post(`/groups/${id}/members`, { email }),
};

export const expenseService = {
  create: (data) => api.post('/expenses', data),
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const settlementService = {
  getByGroup: (groupId) => api.get(`/settlements/groups/${groupId}/settlements`),
  getOptimized: (groupId) =>
    api.get(`/settlements/groups/${groupId}/settlements/optimize`),
  create: (data) => api.post('/settlements', data),
  markPaid: (id) => api.patch(`/settlements/${id}/pay`),
};

export const dashboardService = {
  get: () => api.get('/dashboard'),
};

export const demoService = {
  getInfo: () => api.get('/demo/info'),
  reset: () => api.post('/demo/reset'),
};

