import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  // baseURL: 'https://localhost:7094/api',
  baseURL: 'https://app-gender-eastus-dev-001-f3bhc0afc4eygzf2.canadacentral-01.azurewebsites.net/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cấu hình khi call api se kèm theo token vào header
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

// Refresh token
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');
      const username = Cookies.get('username');

      if (!refreshToken) return Promise.reject(err);
      if (!username) return Promise.reject(err);

      try {
        const res = await api.post('/auth/refresh', {
          refreshToken,
          username,
        });

        console.log('res refresh token', res);

        const newAccessToken = res.data.accessToken;

        Cookies.set('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (e) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  },
);

export default api;
