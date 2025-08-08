import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../constants/env";

// Configuración base del cliente Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Interceptor de REQUEST: adjunta token y headers estándar
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAzureAdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      config.headers["X-Client-Version"] = "2.0";
      config.headers["Content-Type"] = "application/json";
    } catch (_) {
      // Si falla obtener token se continúa; backend responderá 401
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Obtiene token almacenado y valida expiración
async function getAzureAdToken(): Promise<string | null> {
  try {
    let token = sessionStorage.getItem("azure-ad-token");
    if (token && isTokenValid(token)) return token;
    token = localStorage.getItem("azure-ad-token");
    if (token && isTokenValid(token)) return token;
    return null;
  } catch (_) {
    return null;
  }
}

// Verifica expiración simple del JWT
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return !!payload.exp && payload.exp > now;
  } catch (_) {
    return false;
  }
}

// Interceptor de RESPONSE: reintenta 401 una sola vez intentando refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAzureAdToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (_) {
        // Falló refresh → redirigir a login
        window.location.href = "/login";
      }
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Placeholder de refresh (integrar con MSAL cuando se implemente)
async function refreshAzureAdToken(): Promise<string | null> {
  return null; // Forzar flujo de re-login por ahora
}

export default api;
