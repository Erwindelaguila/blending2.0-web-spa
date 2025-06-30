import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/env";

// Simulamos que tienes un store de auth (ajusta según tu implementación)
// import { useAuthStore } from "../store/AuthStore";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Simular token (descomenta cuando tengas auth real)
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
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.error('Token expirado');
      // useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
