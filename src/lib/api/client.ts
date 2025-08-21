import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "../constants/env";
import { AuthService } from "@/services/auth.service";

// Configuración base del cliente Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAzureAdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      config.headers["X-Client-Version"] = "2.0";

      // Solo poner application/json si no es FormData
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      } else {
        // Dejar que Axios ponga el multipart/form-data con boundary
        delete config.headers["Content-Type"];
      }
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
    // Primero buscar token ya guardado en storage
    let token = sessionStorage.getItem("azure-ad-token");
    if (token && isTokenValid(token)) return token;
    
    token = localStorage.getItem("azure-ad-token");
    if (token && isTokenValid(token)) return token;
    
    // Solo si no hay token válido, intentar obtener uno nuevo del AuthService
    const { token: freshToken } = await AuthService.getExistingUser();
    if (freshToken && isTokenValid(freshToken)) return freshToken;
    
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

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
        await AuthService.login();
      }
      await AuthService.login();
    }

    return Promise.reject(error);
  }
);

// Refresh token usando AuthService
async function refreshAzureAdToken(): Promise<string | null> {
  try {
    return await AuthService.refreshToken();
  } catch (_) {
    return null;
  }
}

export default api;
