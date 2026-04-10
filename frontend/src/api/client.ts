import axios from 'axios';

const API_BASE_URL = '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string) =>
    client.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
};

export const applicationAPI = {
  getAll: () => client.get('/applications'),
  getById: (id: string) => client.get(`/applications/${id}`),
  create: (data: any) => client.post('/applications', data),
  update: (id: string, data: any) => client.put(`/applications/${id}`, data),
  delete: (id: string) => client.delete(`/applications/${id}`),
  parseJobDescription: (jobDescription: string) =>
    client.post('/applications/parse', { jobDescription }),
  generateSuggestions: (role: string, company: string, skills: string[]) =>
    client.post('/applications/suggestions', { role, company, skills }),
};

export default client;
