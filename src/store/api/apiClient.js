import axios from 'axios';
import { BASE_URL } from './api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If 401, clear token and redirect to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
};

// ── Projects ──────────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => apiClient.get('/api/projects'),
  getById: (id) => apiClient.get(`/api/projects/${id}`),
  create: (data) => apiClient.post('/api/projects', data),
  rename: (id, data) => apiClient.put(`/api/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/api/projects/${id}`),
};

// ── Folders ───────────────────────────────────────────────────────
export const foldersApi = {
  getByProject: (projectId) => apiClient.get(`/api/projects/${projectId}/folders`),
  create: (projectId, data) => apiClient.post(`/api/projects/${projectId}/folders`, data),
  rename: (id, data) => apiClient.put(`/api/folders/${id}`, data),
  delete: (id) => apiClient.delete(`/api/folders/${id}`),
};

// ── Schema ────────────────────────────────────────────────────────
export const schemaApi = {
  get: (folderId) => apiClient.get(`/api/folders/${folderId}/schema`),
  // data = { schemas: { [name]: { schemaYaml, templateHtml, templateCss } }, entrySchema }
  upsert: (folderId, data) => apiClient.put(`/api/folders/${folderId}/schema`, data),
};

// ── Files ─────────────────────────────────────────────────────────
export const filesApi = {
  getByFolder: (folderId) => apiClient.get(`/api/folders/${folderId}/files`),
  getById: (id) => apiClient.get(`/api/files/${id}`),
  create: (folderId, data) => apiClient.post(`/api/folders/${folderId}/files`, data),
  update: (id, data) => apiClient.put(`/api/files/${id}`, data),
  delete: (id) => apiClient.delete(`/api/files/${id}`),
};

// ── Breadcrumbs ─────────────────────────────────────────────────────────
export const breadcrumbApi = {
  get: (type, id) => apiClient.get(`/api/breadcrumb/${type}/${id}`),
};

// ── Pdf Export ─────────────────────────────────────────────────────────
export const pdfExport = {
  post: (id, data, responseType) => apiClient.post(`/api/export/pdf/${id}`, data, responseType),
};