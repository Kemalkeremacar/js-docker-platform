import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Images
  getImages: () => api.get('/images').then(res => res.data),
  buildImage: (name, dockerfile) => api.post('/images/build', { name, dockerfile }).then(res => res.data),

  // Containers
  getContainers: () => api.get('/containers').then(res => res.data),
  runContainer: (image, options) => api.post('/containers/run', { image, options }).then(res => res.data),
  stopContainer: (id) => api.post(`/containers/${id}/stop`).then(res => res.data),
  removeContainer: (id) => api.delete(`/containers/${id}`).then(res => res.data),
  getContainerLogs: (id) => api.get(`/containers/${id}/logs`).then(res => res.data),

  // Stats
  getStats: () => api.get('/stats').then(res => res.data),
};