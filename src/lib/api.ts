import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { token } from './token';
import { API_BASE } from './routes';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = token.access;
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

// Handle 401 errors & refresh automatically
let isRefreshing = false;
let refreshQueue: ((newToken: string) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig | undefined;

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (isRefreshing) {
        // Wait for the ongoing refresh
        return new Promise((resolve) => {
          refreshQueue.push((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      // Call refresh endpoint
      const refreshToken = token.refresh;
      if (!refreshToken) throw new Error('No refresh token');

      const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = res.data;

      token.set(accessToken, newRefresh);
 
      // Retry the original request
      original.headers.Authorization = `Bearer ${accessToken}`;
      refreshQueue.forEach((fn) => fn(accessToken));
      refreshQueue = [];

      return api(original);
    } catch (err) {
      token.clear(); 
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
