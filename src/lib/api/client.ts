import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/env";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Simular token (descomentar cuando tengamos auth real)
    // const { token } = useAuthStore.getState();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Mock token para desarrollo
    const mockToken = "mock-jwt-token-123";
    if (mockToken) {
      config.headers.Authorization = `Bearer ${mockToken}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Token expirado');
    }
    return Promise.reject(error);
  }
);

export default api;
