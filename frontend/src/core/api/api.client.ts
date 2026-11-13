import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

      ApiClient.instance = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      // Request Interceptor: Inject JWT Token jika tersedia
      ApiClient.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem('loker_auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response Interceptor: Tangani error 401 (token expired / invalid)
      ApiClient.instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          if (error.response?.status === 401) {
            // Hapus token lokal jika sesi habis
            localStorage.removeItem('loker_auth_token');
            localStorage.removeItem('loker_auth_user');

            // Jika sedang tidak di halaman login atau register, redirect ke login
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
              window.location.href = '/login';
            }
          }
          return Promise.reject(error);
        }
      );
    }

    return ApiClient.instance;
  }
}

export const apiClient = ApiClient.getInstance();
export default apiClient;

