import axios from 'axios';

const API_BASE_URL = 'https://start-site-server.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('AdminToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
