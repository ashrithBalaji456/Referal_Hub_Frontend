import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recruiterApi = {
  getAll: () => api.get('/recruiters'),
  getById: (id) => api.get(`/recruiters/${id}`),
  create: (data) => api.post('/recruiters', data),
  update: (id, data) => api.put(`/recruiters/${id}`, data),
  delete: (id) => api.delete(`/recruiters/${id}`),
  updateStatus: (id, status) => api.patch(`/recruiters/${id}/status`, null, { params: { status } }),
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

export default api;
