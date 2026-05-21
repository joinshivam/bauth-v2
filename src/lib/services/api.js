import axios from 'axios';
const rawBase =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE ||
  'https://bauth-backend.onrender.com/api';

export const API_BASE = rawBase.replace(/\/+$/, '').endsWith('/api') ? rawBase.replace(/\/+$/, '') : `${rawBase.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (payload && typeof payload === 'object') {
      return Promise.reject({
        ...payload,
        status,
      });
    }

    return Promise.reject({
      message: payload || error.message || 'Server Error',
      status,
    });
  }
);

export default api;
