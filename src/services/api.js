import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://referal-hub-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Redirect to login if token is expired or invalid (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      // If we are not already on the login page, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const recruiterApi = {
  getAll: () => api.get('/recruiters'),
  getById: (id) => api.get(`/recruiters/${id}`),
  create: (data) => api.post('/recruiters', data),
  update: (id, data) => api.put(`/recruiters/${id}`, data),
  delete: (id) => api.delete(`/recruiters/${id}`),
  updateStatus: (id, status) => api.patch(`/recruiters/${id}/status`, null, { params: { status } }),
  importCsv: (formData) => api.post('/recruiters/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  exportCsv: (setNumber) => api.get('/recruiters/export', {
    params: setNumber ? { setNumber } : {},
    responseType: 'blob',
  }),
  exportCsvUrl: (setNumber) => `${API_BASE_URL}/recruiters/export${setNumber ? `?setNumber=${setNumber}` : ''}`,
  getWaiting: () => api.get('/recruiters/waiting'),
  addWaiting: (ids) => api.post('/recruiters/add-waiting', ids),
  addAllWaiting: () => api.post('/recruiters/add-all-waiting'),
  dismissWaiting: (ids) => api.post('/recruiters/dismiss-waiting', ids),
  dismissAllWaiting: () => api.post('/recruiters/dismiss-all-waiting'),
};

export const templateApi = {
  getAll: () => api.get('/templates'),
  getById: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post('/templates', data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
};

export const resumeApi = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  upload: (formData) => api.post('/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/resumes/${id}`),
  markAsActive: (id) => api.patch(`/resumes/${id}/active`),
  getActive: () => api.get('/resumes/active'),
};

export const campaignApi = {
  getAll: () => api.get('/campaigns'),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  enable: (id) => api.patch(`/campaigns/${id}/enable`),
  disable: (id) => api.patch(`/campaigns/${id}/disable`),
  preview: (id, recruiterId) => api.get(`/campaigns/${id}/preview`, { params: { recruiterId } }),
  trigger: (id, recruiterId) => api.post(`/campaigns/${id}/trigger`, null, { params: { recruiterId } }),
  triggerMultiple: (id, recruiterIds) => api.post(`/campaigns/${id}/trigger-multiple`, recruiterIds),
  triggerBatch: (id, limit) => api.post(`/campaigns/${id}/trigger-batch`, null, { params: { limit } }),
  triggerScheduler: () => api.post('/campaigns/trigger-scheduler'),
};

export const historyApi = {
  getFiltered: (params) => {
    // Clean up empty params
    const cleanParams = {};
    Object.keys(params || {}).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return api.get('/email-history', { params: cleanParams });
  },
};

export const profileApi = {
  get: () => api.get('/candidate-profile'),
  update: (data) => api.put('/candidate-profile', data),
};

export default api;
